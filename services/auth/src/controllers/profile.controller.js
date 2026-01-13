// import { currentUser } from "../middlewares/current-user.js";
// import { requireAuth } from "../middlewares/require-auth.js";
export const getProfile = async (req, res) => {
    try {
        res.json({
            user: req.currentUser
        });
    }
    catch (err) {
        console.error(err);
    }
};
//# sourceMappingURL=profile.controller.js.map