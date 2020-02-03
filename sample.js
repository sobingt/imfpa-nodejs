
function createWrapProductVariation(product) {
  const paintingTypeArray = ["Canvas Print"];
  const paintingFormatArray = ["Wrap"];
  const colorArray = ["Black", "Brown", "Burgundy", "Natural", "No", "White"];
  const canvasFrameColorArray = ["Black", "Brown", "Natural"];
  const paperFrameColorArray = [
    "Black",
    "Brown",
    "Burgundy",
    "Natural",
    "White"
  ];

  const mattCost = 15;
  const frameCostArray = {
    "Canvas Print": {
      Wrap: 7
    }
  };

  let count = 0;
  let variations = [];
  const sizeStrArray = [
    `${product.w1} cm x ${product.h1} cm`,
    `${product.w2} cm x ${product.h2} cm`,
    `${product.w3} cm x ${product.h3} cm`,
    `${product.w4} cm x ${product.h4} cm`,
    `${product.w5} cm x ${product.h5} cm`,
    `${product.w6} cm x ${product.h6} cm`
  ];
  const sizeArray = [
    { w: product.w1, h: product.h1 },
    { w: product.w2, h: product.h2 },
    { w: product.w3, h: product.h3 },
    { w: product.w4, h: product.h4 },
    { w: product.w5, h: product.h5 },
    { w: product.w6, h: product.h6 }
  ];
  const sku = product.sku;
  const id = product.id;
  for (
    let paintingTypeCount = 0;
    paintingTypeCount < paintingTypeArray.length;
    paintingTypeCount++
  ) {
    let paintingType = paintingTypeArray[paintingTypeCount];
    let frameColorArray;
    let paintingTypeCost;
    let frameSize;
    if (paintingType == "Paper Print") {
      frameColorArray = paperFrameColorArray;
      paintingTypeCost = 25;
      frameSize = 0.75;
    } else {
      frameColorArray = canvasFrameColorArray;
      paintingTypeCost = 34;
      frameSize = 0.5;
    }

    //Select Painting Type
    for (let sizeCount = 0; sizeCount < sizeArray.length; sizeCount++) {
      let size = sizeArray[sizeCount];
      let matt;
      if (size.w == 30) {
        matt = 1;
      } else if (size.w == 40) {
        matt = 1;
      } else if (size.w == 50) {
        matt = 2;
      } else if (size.w == 60) {
        matt = 2;
      } else if (size.w == 70) {
        matt = 3;
      } else if (size.w == 80) {
        matt = 3;
      }
      for (
        let paintingFormatCount = 0;
        paintingFormatCount < paintingFormatArray.length;
        paintingFormatCount++
      ) {
        let paintingFormat = paintingFormatArray[paintingFormatCount];
        if (paintingType == "Paper Print" && paintingFormat == "Wrap") {
          break;
        }
        if (paintingFormat == "Framed") {
          for (
            let frameColorCount = 0;
            frameColorCount < frameColorArray.length;
            frameColorCount++
          ) {
            let frameColor = frameColorArray[frameColorCount];
            let frameCost = frameCostArray[paintingType][frameColor];
            count++;
            //console.log(count, paintingType, size.w + ' cm x ' + size.h +' cm',  matt, paintingFormat, frameColor)
            let price = variation.getProductVariationPrice(
              size.w,
              size.h,
              matt,
              frameSize,
              paintingTypeCost,
              mattCost,
              frameCost
            );
            let description = `Painting Type: ${paintingType}, Painting Size: ${size.w} cm x ${size.h} cm, Frames: ${frameColor}, Painting Format: ${paintingFormat}`;
            let data = variation.getProductVariation({
              description,
              sku,
              price,
              width: size.w,
              height: size.h,
              paintingType,
              frameColor,
              paintingFormat
            });
            //console.log(count, data)
            variations.push(data);
          }
        } else {
          let frameColor = "No";
          let frameCost = frameCostArray[paintingType][frameColor];
          count++;
          let price = variation.getProductVariationPrice(
            size.w,
            size.h,
            matt,
            frameSize,
            paintingTypeCost,
            mattCost,
            frameCost
          );
          let description = `Painting Type: ${paintingType}, Painting Size: ${size.w} cm x ${size.h} cm, Frames: ${frameColor}, Painting Format: ${paintingFormat}`;
          let data = variation.getProductVariation({
            description,
            sku,
            price,
            width: size.w,
            height: size.h,
            paintingType,
            frameColor,
            paintingFormat
          });
          //console.log(count, data)
          variations.push(data);
        }
      }
    }
  }

  return {
    id,
    variations
  };
}
