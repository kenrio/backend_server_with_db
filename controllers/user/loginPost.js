const UserModel = require("../../models/user");

module.exports = (req, res) => {
	UserModel.findOne({email: req.body.email})
		.then((savedData) => {
			if (savedData) {
				if (req.body.password === savedData.password) {
					req.session.userId = savedData._id.toString();
					res.redirect("/");
				} else {
					res.render("error", {message: "/user/login のエラー: パスワードが間違っています"});
				}
			} else {
				res.render("error", {message: "/user/login のエラー: ユーザーが存在していません"});
			}
		})
		.catch((error) => {
			res.render("error", {message: "/user/login のエラー: エラーが発生しました"});
		})
};
