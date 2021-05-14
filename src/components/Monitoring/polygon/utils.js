export function drawPolygons(mapData) {
    return (
        mapData.map(item => {
            return item.geometry.coordinates.map(item2 => {
                return item2.map(item3 => {
                    return new window.N.LatLng(item3[1], item3[0]);
                });
            });
        })
    )
}

export function areaChange(mapData, ctpName, index) {
    return mapData.filter(item => {
        return (
            ctpName !== null &&
            item.properties.SIG_CD.substring(0, 2).includes(ctpName[index])
        );
    });
}

export function centerXY(mapData, index) {
    const data = mapData.map(item => {
        let zeroIndex = [];
        zeroIndex.push(item.geometry.coordinates[0]);
        return zeroIndex.map((item, index, array) => {
            const centroidData = centroid(item);
            return { lat: centroidData[1], lng: centroidData[0] };
        });
    });

    return data.flat()[index];
}

function centroid(data) {
    let area = 0;
    let factor = 0;
    let centerX = 0;
    let centerY = 0;

    data.forEach(
        (element, index, array) =>
            array.length - 1 > index &&
            ((factor =
                element[0] * array[index + 1][1] - array[index + 1][0] * element[1]),
            (area += factor),
            (centerX += (element[0] + array[index + 1][0]) * factor),
            (centerY += (element[1] + array[index + 1][1]) * factor))
    );

    area *= 3;
    factor = 1 / area;
    centerX *= factor;
    centerY *= factor;

    return [centerX, centerY];
}