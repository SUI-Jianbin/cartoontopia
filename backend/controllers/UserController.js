// user controller
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin = require('../models/admin');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User is not found!' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password, please try again!' });
        }
        const adminRole = await Admin.find({});
        res.status(200).json({user, adminRole});

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({});
        console.log("all users are:", allUsers);
        res.status(200).json(allUsers);
    }catch (error) {
        console.error("Failed to retrieve all users", error);
        res.status(500).json({ message: "Error retrieving call users: " + error.message });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const _id  = req.params.id;
        const user = await User.findById(_id);
        res.status(200).json(user);
    }catch (error) {
        console.error("Failed to retrieve all users", error);
        res.status(500).json({ message: "Error retrieving call users: " + error.message });
    }
}

exports.getAllAdmins = async (req, res) => {
    try {
        const allAdmins = await Admin.find({});
        console.log("all admins are:", allAdmins);
        res.status(200).json(allAdmins);
    }catch (error) {
        console.error("Failed to retrieve all admins", error);
        res.status(500).json({ message: "Error retrieving call admins: " + error.message });
    }
}

exports.updateUserRole = async (req, res) => {
    try{

        const { userId } = req.params;
        const { isAdmin }  = req.body;
        const deletedAdmin = await Admin.findByIdAndDelete(userId);

        if(deletedAdmin == null){
            console.log("Add");
            const newAdmin = new Admin({_id: userId});
            await newAdmin.save();
            res.status(200).json("admin");
        }
        else{
            if (!deletedAdmin) {
                return res.status(404).json({ message: 'User not found' });
            }else{
                return res.status(200).json("member");
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

}

exports.updateFavouritesByUsername = async (req, res) => {
    const { username } = req.params;
    const { favouriteCharacterList } = req.body;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { $set: { favouriteCharacterList: favouriteCharacterList } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user favourites by username:', error);
        res.status(500).send(error.message);
    }
};

exports.register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists:', existingUser);
            return res.status(400).json({ message: 'User already exists!' });
        }
        console.log(firstname);
        console.log(email);
        // Create new user
        console.log('Creating new user:', firstname);
        const newUser = new User({
            firstname,
            lastname,
            email,
            password,
        });
        // Save the user to the database
        console.log('Saving new user to database');
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Error occurred:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getFavourCharacters = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User is not found!' });
        }
        //const token = jwt.sign({ id: user._id }, '6722d69e31b5988f5d3ff9bf7a35df8b4e28b28c3da42b54a2fb9cd40970309250608b7ae83eac3f237f82dc3aaae4e03aeb953018aacb4efb6d97e50ee6baf8', { expiresIn: '2h' });
        const favorCharacterList = user.favouriteCharacterList || [];
        res.status(200).json({favorCharacterList});
    }
    catch (err) {
        res.status(520).json({ message: err.message });
    }
};
