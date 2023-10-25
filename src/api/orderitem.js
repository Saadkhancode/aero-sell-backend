import sendMail from '../middlewares/send-email.js';
import IngredientModel from '../models/ingredients.js';
import orderitem from '../models/orderitem.js';
import Product from '../models/product.js';

export const getOrderItemByUserId = async (req, res) => {
  let filter = {}
  if (req.query.userId) {
    filter = { userId: req.query.userId.split(',') }
  } else if (req.query.orderId) {
    filter = { orderId: req.query.orderId.split(',') }
  } else if (req.query.orderStatus) {
    filter = { orderStatus: req.query.orderStatus.split(',') }
  }
  let data = await orderitem.find(filter).populate({ path: "product", populate: { path: "categoryId", model: "category", populate: { path: "displayManagerId", model: "display" } } }).populate('customerId').populate("selectedModifiers").populate('paymentType').populate('table').populate({ path: "orderId", populate: { path: "employeeId", model: "employee" }, populate: { path: "recieptId", model: "reciept" } }).populate('ReservedTable')

  res.send(data);
}
export const getOrderItemOrderStatus = async (req, res) => {
  let filter = {}
  if (req.query.userId) {
    filter = { userId: req.query.userId.split(',') }
  }
  let data = await orderitem.find(filter).populate({ path: "product", populate: { path: "categoryId", model: "category", populate: { path: "displayManagerId", model: "display" } } }).populate('customerId').populate("selectedModifiers").populate('paymentType').populate('table').populate({ path: "orderId", populate: { path: "employeeId", model: "employee" }, populate: { path: "recieptId", model: "reciept" } }).populate('ReservedTable')
  let onlineOrders = data?.filter((item) => item.orderStatus == 'online')
  console.log('onlineOrders: ', onlineOrders);

  res.send(onlineOrders);
}

export const getOrderItemById = async (req, res) => {

  let data = await orderitem.findOne(req.params).populate({ path: "product", populate: { path: "categoryId", model: "category", populate: { path: "displayManagerId", model: "display" } } }).populate('customerId').populate('paymentType').populate('table').populate({ path: "orderId", populate: { path: "employeeId", model: "employee" }, populate: { path: "recieptId", model: "reciept" } }).populate('ReservedTable')
  res.send(data);
}

export const getOrderItems = async (req, res) => {

  let data = await orderitem.find(req.params).populate({ path: "product", populate: { path: "categoryId", model: "category", populate: { path: "displayManagerId", model: "display" } } }).populate('customerId').populate('paymentType').populate('table').populate({ path: "product", populate: { path: "userId", model: "user" } }).populate({ path: "orderId", populate: { path: "employeeId", model: "employee" } }).populate('ReservedTable')
  res.send(data);
}

export const postOrderItem = async (req, res) => {
  const { orderId, table, product, selectedModifiers, loyalityOffer, couponOffer, ReservedTable, points, orderStatus, taxValue, productWithQty, priceExclTax, lineValueExclTax, lineValueTax, lineValue, units, text, customerId, dueamount, createdAt, updatedAt, userId, paymentType, split, tax, Color, customername, vehicle, taxfake, OrderNo,dropStatus } = req.body;
  const data = await new orderitem({ orderId, table, product, orderStatus, selectedModifiers, loyalityOffer, couponOffer, points, ReservedTable, taxValue, productWithQty, priceExclTax, lineValueExclTax, lineValueTax, lineValue, units, text, customerId, dueamount, createdAt, updatedAt, userId, paymentType, split, tax, Color, customername, vehicle, taxfake, OrderNo,dropStatus });
  let prod = []
  let ingredientsData = []
  prod = product
  await data.save().then(async (result) => {
    // const customerPoints = priceExclTax / 5;
    // const customerById = await customer.findById(customerId)
    if (Array.isArray(prod) && prod.length > 0) {
    prod.map(async (item) => {
      console.log('item: ', item);
      const products = await Product.findById({ _id: item._id })
      .populate('userId')
      .populate({
        path: "ingredient",
        populate: { path: "ingredient.ingredientId", model: "ingredientsModel" }
      });
      // console.log('products: ', products);
      // await Product.findByIdAndUpdate({ _id: products._id }, { $set: { "totalQuantity": products.totalQuantity - item.quantity } })
      const totalQuantity = parseFloat(products.totalQuantity);
      const quantity = parseFloat(item.quantity);
      
      if (!isNaN(totalQuantity) && !isNaN(quantity)) {
        // Perform the subtraction only if both values are valid numbers
        const updatedTotalQuantity = totalQuantity - quantity;
        await Product.findByIdAndUpdate(item._id, { $set: { "totalQuantity": updatedTotalQuantity } });
      }
      let filteredProductsName = []
      let userEmail = products.userId.email
      if (products.totalQuantity <= 5) {
        filteredProductsName.push(products.name)
      }
      if (products.ingredient && products.ingredient.length > 0) {
        const ingredients = [];
        for (const ingredientItem of products.ingredient) {
          if (ingredientItem.ingredientId) {
            const ingredientId = ingredientItem.ingredientId;
            const ingredient = await IngredientModel.findOne({ _id: ingredientId });
            if (ingredient.stockHistory && ingredient.stockHistory.length > 0) {
              const sortedStockHistory = ingredient.stockHistory.sort((a, b) => {
                const dateA = new Date(a.expiry);
                const dateB = new Date(b.expiry);
                return dateA - dateB;
              });
              let remainingQuantity = ingredientItem.quantity * item.quantity;
              let stocksToRemove = [];
              for (const stockItem of sortedStockHistory) {
                if (remainingQuantity <= 0) {
                  break;
                }
                if (stockItem.stock >= remainingQuantity) {
                  stockItem.stock -= remainingQuantity;
                  remainingQuantity = 0;
                } else {
                  remainingQuantity -= stockItem.stock;
                  stockItem.stock = 0;
                }
                if (stockItem.stock === 0) {
                  stocksToRemove.push(stockItem);
                }
              }
              for (const stockToRemove of stocksToRemove) {
                const indexToRemove = ingredient.stockHistory.indexOf(stockToRemove);
                if (indexToRemove !== -1) {
                  ingredient.stockHistory.splice(indexToRemove, 1);
                }
              }
              await ingredient.save();
            }

            ingredients.push(ingredient);
          }
        }
        console.log("ingredients: ", ingredients);
        return ingredients;
      }



      if (products && userEmail && filteredProductsName) {
        sendMail(userEmail, "Low Stock Alerts", `<h2 style="background-color: #f1f1f1; padding: 20px;width:50%">These Products Are  Low  In  Stock</h2><br><h3 style="background-color: #f1f1f1; width:60%">${filteredProductsName}</h3>`)
      }
    })
  }else{
    console.warn('Invalid or empty "product" array');
  }
    // if (customerById) {
    //   const customerdata = await customer.findByIdAndUpdate(customerById, { $set: { "CustomerLoyalty.Points": !isNaN(customerById?.CustomerLoyalty?.Points) + customerPoints } })
    //   console.log("customerAfterAddedPoints", customerdata);
    //   res.json({
    //     orderId: result.orderId,
    //     product: result.product,
    //     displayStatus: result.displayStatus,
    //     table: result.table,
    //     split: result.split,
    //     Status: result.Status,
    //     selectedModifiers: result.selectedModifiers,
    //     loyalityOffer: result.loyalityOffer,
    //     couponOffer: result.couponOffer,
    //     dueamount: result.dueamount,
    //     points: result.points,
    //     taxValue: result.taxValue,
    //     productWithQty: result.productWithQty,
    //     priceExclTax: result.priceExclTax,
    //     productPrice: result.productPrice,
    //     lineValueExclTax: result.lineValueExclTax,
    //     lineValueTax: result.lineValueTax,
    //     lineValue: result.lineValue,
    //     units: result.units,
    //     text: result.text,
    //     tax: result.tax,
    //     userId: result.userId,
    //     customerId: result.customerId,
    //     paymentType: result.paymentType,
    //     createdAt: result.createdAt,
    //     updatedAt: result.updatedAt,
    //     orderStatus: result.orderStatus,
    //     ReservedTable: result.ReservedTable,
    //     Color: result.Color,
    //     customername: result.customername,
    //     vehicle: result.vehicle,
    //     taxfake: result.taxfake,
    //     OrderNo: result.OrderNo,

    //   })
    // } else {
      res.json({
        orderId: result.orderId,
        product: result.product,
        dueamount: result.dueamount,
        displayStatus: result.displayStatus,
        loyalityOffer: result.loyalityOffer,
        couponOffer: result.couponOffer,
        points: result.points,
        split: result.split,
        Status: result.Status,
        OrderNo: result.OrderNo,
        taxValue: result.taxValue,
        productWithQty: result.productWithQty,
        priceExclTax: result.priceExclTax,
        productPrice: result.productPrice,
        lineValueExclTax: result.lineValueExclTax,
        lineValueTax: result.lineValueTax,
        lineValue: result.lineValue,
        units: result.units,
        text: result.text,
        tax: result.tax,
        userId: result.userId,
        customerId: result.customerId,
        paymentType: result.paymentType,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        orderStatus: result.orderStatus,
        ReservedTable: result.ReservedTable,
        Color: result.Color,
        customername: result.customername,
        vehicle: result.vehicle,
        dropStatus:result.dropStatus
      })
  }).catch(err => {
    res.status(400).send('unable to save database');
    console.log(err)
  })
}
export const updateOrderItem = async (req, res) => {

  console.log(req.params.id)
  let data = await orderitem.findByIdAndUpdate(
    { _id: req.params._id }, {
    $set: req.body
  },
    { new: true }
  );
  if (data)
    res.send({ message: "orderitem data updated successfully" });
  else
    res.send({ message: "orderitem data cannot be updated successfully" })
}

export const deleteOrderItem = async (req, res) => {
  console.log(req.params)
  let data = await orderitem.deleteOne(req.params)
  if (data)
    res.send({ message: "orderitem data delete successfully" });
  else
    res.send({ message: "orderitem data cannot delete successfully" })
}


