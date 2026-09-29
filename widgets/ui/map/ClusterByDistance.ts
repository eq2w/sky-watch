import type { IClusterMethod, RenderProps, ClustererObject } from "@yandex/ymaps3-clusterer";

const worldPixelSize = 256;

export function clusterByDistance({ distancePx }: { distancePx: number }): IClusterMethod {
    return {
        render({ map, features }: RenderProps): ClustererObject[] {
            if (distancePx <= 0) {
                return features.map((feature) => ({
                    world: map.projection.toWorldCoordinates(feature.geometry.coordinates),
                    lnglat: feature.geometry.coordinates,
                    clusterId: String(feature.id),
                    features: [feature],
                }))
            }

            const distance = distancePx / ((2 ** map.zoom / 2) * worldPixelSize);
            const distanceSq = distance * distance;

            const points = features.map((f) => map.projection.toWorldCoordinates(f.geometry.coordinates));

            const parent = features.map((_, i) => i);

            const findRoot = (i: number): number => {
                while (parent[i] !== i) {
                    parent[i] = parent[parent[i]]; 
                    i = parent[i];
                }
                return i;
            };

            const union = (a: number, b: number) => {
                const rootA = findRoot(a);
                const rootB = findRoot(b);
                if (rootA !== rootB) parent[rootB] = rootA;
            };

            const cells = new Map<string, number[]>();

            points.forEach((p, i) => {
                const cellX = Math.floor(p.x / distance);
                const cellY = Math.floor(p.y / distance);

                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const bucket = cells.get(`${cellX + dx}:${cellY + dy}`);
                        if (!bucket) continue;
                        for (const j of bucket) {
                            const ddx = p.x - points[j].x;
                            const ddy = p.y - points[j].y;
                            if (ddx * ddx + ddy * ddy <= distanceSq) union(i, j);
                        }
                    }
                }

                const key = `${cellX}:${cellY}`;
                const bucket = cells.get(key);
                if (bucket) bucket.push(i);
                else cells.set(key, [i]);
            });

            const groups = new Map<number, number[]>();
            features.forEach((_, i) => {
                const root = findRoot(i);
                const group = groups.get(root);
                if (group) group.push(i);
                else groups.set(root, [i]);
            });

            return [...groups.values()].map((indexes) => {
                const groupFeatures = indexes.map((i) => features[i]);

                if (indexes.length === 1) {
                    const feature = groupFeatures[0];
                    return {
                        world: points[indexes[0]],
                        lnglat: feature.geometry.coordinates,
                        clusterId: String(feature.id),
                        features: groupFeatures,
                    };
                }

                let sumX = 0;
                let sumY = 0;
                for (const i of indexes) {
                    sumX += points[i].x;
                    sumY += points[i].y;
                }
                const world = { x: sumX / indexes.length, y: sumY / indexes.length };

                return {
                    world,
                    lnglat: map.projection.fromWorldCoordinates(world),
                    clusterId: "cluster-" + groupFeatures.map((f) => String(f.id)).sort().join("|"),
                    features: groupFeatures,
                };
            });
        },
    };
}