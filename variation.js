const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const api = new WooCommerceRestApi({
  url: "https://imfpa.org",
  consumerKey: "ck_f5d71b7ed9edbd6dee006343031b55296ee98a1d",
  consumerSecret: "cs_d8dbac9a6e06a6943fd088b75d16a77cd1cb3211",
  version: "wc/v3"
});

exports.getProductWrapVariation = function(data) {
  const { sku, description, price, width, height} = data;
  const paintingSize = `${width} cm x ${height} cm`;
  return {
    description: `${description}`,
    price: `${price}`,
    regular_price: `${price}`,
    image: {
      src: `https://s3.ap-south-1.amazonaws.com/imfpa.org/paintings/${sku}_800-White-Wrap.jpg`
    },
    dimensions: {
      length: "",
      width: `${width}`,
      height: `${height}`
    },
    attributes: [
      {
        id: 0,
        name: "Painting Size",
        option: `${paintingSize}`
      }
    ]
  };
};

exports.getProductVariation = function(data) {
  const {
    description,
    price,
    width,
    height,
    paintingType,
    frameColor,
    paintingFormat
  } = data;
  const paintingSize = `${width} cm x ${height} cm`;
  return {
    description: `${description}`,
    price: `${price}`,
    regular_price: `${price}`,
    dimensions: {
      length: "",
      width: `${width}`,
      height: `${height}`
    },
    attributes: [
      {
        id: 4,
        name: "Painting Type",
        option: `${paintingType}`
      },
      {
        id: 0,
        name: "Painting Size",
        option: `${paintingSize}`
      },
      {
        id: 3,
        name: "Frames",
        option: `${frameColor}`
      },
      {
        id: 0,
        name: "Painting Format",
        option: `${paintingFormat}`
      }
    ]
  };
};

exports.postCreatBulkProductVariations = function(id, data, callback) {
  api
    .post(`products/${id}/variations/batch`, data)
    .then(response => {
      callback({
        data: response.data,
        message: "Variations Added"
      });
    })
    .catch(error => {
      console.log("ERROR");
      console.log(error);
      callback({
        data: {
          id: id,
          data: {},
          error: error.response.data
        },
        message: "Variations Error"
      });
    });
};

exports.getProductList = function(data, callback) {
  api
    .get(
      `products?category=${data.catId}&per_page=${data.per_page}&page=${data.page}`
    )
    .then(response => {
      callback({
        data: response.data,
        message: "Get Products"
      });
    })
    .catch(error => {
      console.log(error);
      callback({
        data: {
          id: id,
          data: {},
          error: error
        },
        message: "Variations Error"
      });
    });
};

exports.getProductBySKU = function(sku, callback) {
  api
    .get(`products?sku=${sku}&filter[meta]=true`)
    .then(response => {
      callback({
        data: response.data,
        message: "Got Products"
      });
    })
    .catch(error => {
      console.log("error");
    console.log(error);
      callback({
        data: {
          id: 1,
          data: {},
          error: error
        },
        message: "Variations Error"
      });
    });
};

exports.getProductVariations = function(id, callback) {
  api
    .get(`products/${id}/variations?per_page=100`)
    .then(response => {
      callback({
        data: response.data,
        message: "Variation Added"
      });
    })
    .catch(error => {
      console.log(error);
      callback({
        data: {
          id: id,
          data: [],
          error: error.response.data
        },
        message: "Variation Error"
      });
    });
};

exports.postCreateProductVariations = function(id, data, callback) {
  api
    .post(`products/${id}/variations`, data)
    .then(response => {
      callback({
        data: response.data,
        message: "Variation Added"
      });
    })
    .catch(error => {
      callback({
        data: {
          id: id,
          data: data.description,
          error: error.response.data
        },
        message: "Variation Error"
      });
    });
};

exports.getProductVariationPrice = function(
  w,
  h,
  matt,
  frameSize,
  paintingCost,
  mattCost,
  frameCost
) {
  w = w / 2.54;
  h = h / 2.54;

  const paintingPerimeter = 2 * w + 2 * h;
  const paintingMattPerimeter = 2 * (matt + w) + 2 * (matt + h);
  const paintingFramePerimeter =
    2 * (frameSize + matt + w) + 2 * (frameSize + matt + h);
  const totalMattCost = paintingMattPerimeter * mattCost;
  const totalPaintingCost = paintingPerimeter * paintingCost;
  const totalFrameCost = paintingFramePerimeter * frameCost;
  return roundUp(totalPaintingCost + totalFrameCost + totalMattCost, 2);
};

exports.getWrapVariationPrice = function(
  w,
  h,
  minPaintingCost,
  maxPaintingCost,
  wrapCost
) {
  if (w < 60) {
    paintingCost = minPaintingCost || 34;
  } else {
    paintingCost = maxPaintingCost || 34;
  }
  wrapCost = wrapCost || 10;
  console.log(paintingCost);
  console.log(w);
  console.log(wrapCost);
  w = w / 2.54;
  h = h / 2.54;
  const paintingPerimeter = 2 * w + 2 * h;
  const totalPaintingCost = ((w * h) / 144) * paintingCost;
  const totalWrapCost = paintingPerimeter * wrapCost;
  return roundUp(totalPaintingCost + totalWrapCost, 2);
};

exports.getCanvasPrintVariationPrice = function(w, h) {
  paintingCost = 34;
  w = w / 2.54;
  h = h / 2.54;
  const paintingPerimeter = 2 * w + 2 * h;
  const totalPaintingCost = paintingPerimeter * paintingCost;
  const totalWrapCost = 0;
  return roundUp(totalPaintingCost + totalWrapCost, 2);
};

function roundUp(num, precision) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}

roundUp(192.168, 2); //=> 192.2
