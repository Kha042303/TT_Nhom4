const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const Role = require("../models/roles.model");
const UserRole = require("../models/user_roles.model");

const crypto = require("crypto");
const https = require("https");

// Tạo orderId duy nhất
function generateOrderId() {
  return "ORDER_" + Date.now();
}
   //POST /api/v1/payment/create
  // Tạo thanh toán MoMo + Lưu FULL payment trước khi thanh toán

module.exports.create = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { role_id, typePayment } = req.body;

    if (!role_id) {
      return res.status(400).json({
        code: 400,
        message: "role_id là bắt buộc"
      });
    }

    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({
        code: 404,
        message: "Role không tồn tại"
      });
    }

    // Không cho buyer hoặc admin mua
    if (role.role_id === 1) {
      return res.status(400).json({
        code: 400,
        message: "Buyer không thể nâng cấp"
      });
    }

    if (role.role_name === "admin") {
      return res.status(400).json({
        code: 400,
        message: "Không thể mua quyền admin"
      });
    }

    // Giá seller = 50.000
    const amount = 50000;

    if (typePayment !== "momo") {
      return res.status(400).json({
        code: 400,
        message: "Hệ thống chỉ hỗ trợ thanh toán MoMo"
      });
    }
    const order_id = generateOrderId();
    // LƯU PAYMENT TRƯỚC KHI GỌI MOMO
    const paymentRecord = await Payment.create({
      order_id,
      user_id,
      amount,
      status: "pending",
      pay_type: "momo",
      extra_data: JSON.stringify({ user_id, role_id }),
      message: "Đang chờ thanh toán"
    });
    // TẠO YÊU CẦU MOMO
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";

    const requestId = order_id;
    const orderInfo = `Upgrade seller cho user ${user_id}`;
    const redirectUrl = "http://localhost:3000/api/v1/payment/momo-callback";
    const ipnUrl = redirectUrl;

    const extraData = JSON.stringify({ user_id, role_id });

    const rawSignature =
      `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}` +
      `&ipnUrl=${ipnUrl}&orderId=${order_id}&orderInfo=${orderInfo}` +
      `&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}` +
      `&requestId=${requestId}&requestType=payWithMethod`;

    const signature = crypto.createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode,
      requestId,
      amount,
      orderId: order_id,
      orderInfo,
      redirectUrl,
      ipnUrl,
      requestType: "payWithMethod",
      lang: "vi",
      extraData,
      signature
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody)
      }
    };

    const momoReq = https.request(options, momoRes => {
      let data = "";

      momoRes.on("data", chunk => (data += chunk));
      momoRes.on("end", () => {
        const response = JSON.parse(data);

        return res.json({
          code: 200,
          message: "Tạo thanh toán thành công!",
          data: {
            ...paymentRecord.dataValues,
            payUrl: response.payUrl
          }
        });
      });
    });

    momoReq.on("error", e => console.log(e));
    momoReq.write(requestBody);
    momoReq.end();

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi khi tạo thanh toán",
      error: error.message
    });
  }
};
  // GET /api/v1/payment/momo-callback
   //Xử lý thanh toán thành công → Update payment → Update seller role
module.exports.momoCallback = async (req, res) => {
  try {
    const { resultCode, orderId, extraData } = req.query;

    if (resultCode !== "0") {
      return res.status(400).json({
        code: 400,
        message: "Thanh toán thất bại"
      });
    }

    const info = JSON.parse(extraData);
    const user_id = info.user_id;
    const role_id = info.role_id;

    const role = await Role.findByPk(role_id);
    const duration = role.duration_days || 30;
    // CẬP NHẬT PAYMENT THÀNH SUCCESS
    await Payment.update(
      {
        status: "success",
        result_code: 0,
        message: "Thanh toán thành công"
      },
      { where: { order_id: orderId } }
    );
    // KIỂM TRA USER ĐÃ CÓ SELLER CHƯA
    const existingRole = await UserRole.findOne({
      where: {
        user_id,
        role_id: 2,      // seller
        is_active: true
      }
    });

    const now = new Date();
    let newExpire;

    if (existingRole) {
      // QUYỀN ĐÃ TỒN TẠI → KIỂM TRA HẠN
      const expire = new Date(existingRole.expire_at);

      if (expire < now) {
        // ĐÃ HẾT HẠN → reset = hôm nay + 30 ngày
        newExpire = new Date();
        newExpire.setDate(now.getDate() + duration);
      } else {
        // CÒN HẠN → cộng thêm 30 ngày
        newExpire = new Date(expire);
        newExpire.setDate(expire.getDate() + duration);
      }

      existingRole.expire_at = newExpire;
      await existingRole.save();

    } else {
      // CHƯA CÓ SELLER → tạo mới
      newExpire = new Date();
      newExpire.setDate(now.getDate() + duration);

      await UserRole.create({
        user_id,
        role_id: 2,
        start_at: now,
        expire_at: newExpire,
        is_active: true
      });
    }

    return res.redirect("http://localhost:5173/payment-success");

  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      message: "Lỗi callback MoMo",
      error: error.message
    });
  }
};
  // GET /api/v1/payment
module.exports.index = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: User, as: "user", attributes: ["full_name", "email"] }
      ],
      order: [["created_at", "DESC"]]
    });

    res.json({
      code: 200,
      message: "Lấy danh sách thanh toán thành công",
      data: payments
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy danh sách thanh toán",
      error: error.message
    });
  }
};

  // GET /api/v1/payment/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const payment = await Payment.findByPk(id, {
      include: [
        { model: User, as: "user", attributes: ["full_name", "email"] }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy giao dịch"
      });
    }

    res.json({
      code: 200,
      data: payment
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi khi lấy chi tiết thanh toán",
      error: error.message
    });
  }
};
   //PATCH /api/v1/payment/update/:id
module.exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy giao dịch"
      });
    }

    payment.status = status;
    await payment.save();

    res.json({
      code: 200,
      message: "Cập nhật trạng thái thanh toán thành công",
      data: payment
    });

  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Lỗi khi cập nhật thanh toán",
      error: error.message
    });
  }
};
