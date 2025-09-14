const jwt = require("jsonwebtoken");
const Menu = require("../models/menu")
const menuDetails = require("../middleware/menu.middleware")

menuDetails.getAllMenu = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const menus = await Menu.find().select("-password");
        return res.json({ menus }); // return added
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' }); // <-- return added
    }
};
