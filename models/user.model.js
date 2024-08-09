const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    // _id:{
    //     type:Number,
    //     auto:true,
    //     required:true,
    // },
    firstName: {
      type: String,
      //required: true,
    },
    lastName: {
      type: String,
      //required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      //required: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    // Other user fields...

    favoritePlaces: [
      {
        name: {
          type: String,
          //required: true,
        },
        location: {
          type: {
            type: String,
            enum: ["Point"],
            // required: true,
          },
          coordinates: {
            type: [Number],
            // required: true,
          },
        },
      },
    ],
  },
  { timestamps: true },
);

/*userSchema.pre('save',async function(){
  try{
    var user =this;
    const salt = await(bcrypt.genSalt(10));
    const hashpass =await bcrypt.hash(user.password,salt);
  }catch(error){
    throw error;
  }
});

userSchema.methods.comparePassword = async function(userPassword){
  try{
const isMatch =await bcrypt.compare(userPassword,this.password);
  }catch(error){
    throw error;
  }
}*/

module.exports = mongoose.model("User", userSchema);
