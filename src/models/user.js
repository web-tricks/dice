const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

//User Schema
const userSchema = new mongoose.Schema( {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        immutable: true,
        minlength: [4, 'Username should be of minimum 4 characters'],
        validate(value) {
            if (value.includes(' ')) {
                throw new Error('Spaces are not allowed in username');
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (value.length < 8) {
                throw new Error('Password must contain minimum 8 characters');          
            }
            if (value.includes('password')) {
                throw new Error('Password should not include the term password')    
            }
        }
    },
    email: {
        unique: true,
        type: String,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid Email');
            }       
        }
    },
    balance: {
        type: Number,
        default: 500
    },
    seedHash: {
        type: String,
        required: true
    },
    seed: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

//Hashing passwords
userSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});

//Sending custom errors when email or username exists
userSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
      next(new Error('username or email id already exists'));
    } else {
      next(error);
    }
});

//Authentication tokens for users
userSchema.methods.createAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_TOKEN);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

//Login Endpoint for Users
userSchema.statics.loginWithCredentials = async(username, password) => {
    const user = await User.findOne({username});
    if (!user) {
        throw new Error('Invalid Login Details');
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
        throw new Error('Invalid Login Details');
    }
    return user;
}

//Hiding private data of the user from response
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.seed;
    
    return userObject;
}

//Creating virtual property to retrieve bets made by the user
userSchema.virtual('bets', {
    ref: 'Bet',
    localField: '_id',
    foreignField: 'player'
});

//Creating User Model
const User = mongoose.model('User', userSchema);

module.exports = User;