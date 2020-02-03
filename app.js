const express = require("express"),
  app = express(),
  bodyParser = require("body-parser");
const nocache = require("nocache");
const path = require("path");
const variation = require("./variation");
const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const PORT = process.env.PORT || 5000;

const api = new WooCommerceRestApi({
  url: "https://imfpa.org",
  consumerKey: "ck_3e0d5ca94b209bc85ddbba909625317c0f0e7371",
  consumerSecret: "cs_0dd2cb97c1b7104826bcca4a7730b0042cb25864",
  version: "wc/v3"
});

// support parsing of application/json type post data
app.use(bodyParser.json());

app.use(nocache());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/paintings/:id", function (req, res) {
  variation.getProductVariations(req.params.id, function(data) {
    res.json(data);
  });

});
app.post("/", function(req, res, next) {
  console.log(req.body);
  if (req.body.id && req.body.sku) {
    var newVariation = createAllProductVariation(req.body);
    // res.json({
    //   data: newVariation
    // });
    createVariationRequest(newVariation, function(logs) {
      res.json({
        data: logs
      });
    });
  } else if (req.body.sku) {
    variation.getProductBySKU(req.body.sku, function(response) {
      console.log(response.data[0].meta_data);
      response.data[0].meta_data.forEach(data => {
        if (data.key == "image_width") {
          w = Number(data.value);
        }
        if (data.key == "image_height") {
          h = Number(data.value);
        }
      });
      res.json({
        sku: response.data[0].sku,
        id: response.data[0].id,
        variations: response.data[0].variations,
        meta_data: {
          w,
          h
        }
      });
    });
  }
});
app.post("/limited", function(req, res, next) {
  console.log(req.body);
  if (req.body.id && req.body.sku) {
    var newVariation = createWrapProductVariation(req.body);
    res.json({
      data: newVariation
    });
    // createVariationRequest(newVariation, function(logs) {
    //   res.json({
    //     data: logs
    //   });
    // });
  } else if (req.body.sku) {
    variation.getProductBySKU(req.body.sku, function(response) {
      console.log(response.data[0].meta_data);
      response.data[0].meta_data.forEach(data => {
        if (data.key == "image_width") {
          w = Number(data.value);
        }
        if (data.key == "image_height") {
          h = Number(data.value);
        }
      });
      res.json({
        sku: response.data[0].sku,
        id: response.data[0].id,
        variations: response.data[0].variations,
        meta_data: {
          w,
          h
        }
      });
    });
  }
});
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/limited", function(req, res) {
  res.sendFile(path.join(__dirname + "/limited.html"));
});

var server = app.listen(PORT, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});

function createWrapProductVariation(product) {
  const paintingTypeArray = ["Canvas Print"];
  const paintingFormatArray = ["Wrap"];
  const colorArray = ["No"];
  const canvasFrameColorArray = ["Black", "Brown", "Natural"];
  const paperFrameColorArray = [

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
    frameColorArray = canvasFrameColorArray;
    paintingTypeCost = 34;
    frameSize = 0.5;

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
          let frameColor = "No";
          let frameCost = 7;

          let price = variation.getWrapVariationPrice(
            size.w,
            size.h,
            product.minCanvasCost,
            product.maxCanvasCost,
            product.wrapCost
          );
          let description = `Painting Size: ${size.w} cm x ${size.h} cm`;
          let data = variation.getProductWrapVariation({
            description,
            sku,
            price,
            width: size.w,
            height: size.h,
          });
          //console.log(count, data)
          variations.push(data);
    }
  }

  return {
    id,
    variations
  };
}

function createAllProductVariation(product) {
  const paintingTypeArray = ["Paper Print", "Canvas Print"];
  const paintingFormatArray = ["Print", "Framed", "Wrap"];
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
    "Paper Print": {
      Black: 22,
      Brown: 22,
      Burgundy: 20,
      Natural: 21,
      No: 0,
      White: 20
    },
    "Canvas Print": {
      Black: 25,
      Brown: 25,
      Natural: 25,
      No: 0,
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

function createVariationRequest(data, callback) {
  let entry = {
    create: data.variations
  };

  variation.postCreatBulkProductVariations(data.id, entry, function(response) {
    console.log(response);
    var logs = [];
    for (
      let responseIndex = 0;
      responseIndex < response.data.create.length;
      responseIndex++
    ) {
      var log = {
        sku: response.data.create[responseIndex].sku,
        description: response.data.create[responseIndex].description,
        status: response.message
      };
      if (response.data.create[responseIndex].error) {
        log.error = response.data.create[responseIndex].error;
      }
      logs.push(log);
    }
    callback(logs);
  });
}
