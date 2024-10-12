import bcrypt from 'bcryptjs';
import {validationResult} from 'express-validator'
import signup from '../Model/signup.js'
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'

export const Signup = async (req, res) => {
  try {
    const { showroomName, ownerName, cnic, contactNumber, address, email, password, role } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
        }
        console.log('validation pass')
        console.log(errors)

    let user = await signup.findOne({ email });
    const showroom = await signup.findOne({ showroomName }); // Check for existing showroom
    
    if (user) {
        return res.status(400).json({ message: 'User already exists' }); // If user exists, return this message
    }
    
    if (showroom) {
        return res.status(400).json({ message: 'Showroom with this name already exists' }); // If showroom exists, return this message
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user (showroomOwner or client)
    user = new signup({
      showroomName,
      ownerName,
      cnic,
      contactNumber,
      address,
      email,
      password: hashedPassword,
      role
    });
      console.log(hashedPassword)

    await user.save();
if(role=="client") return res.status(201).json({ message: 'User registered successfully' });
if(role=="showroom") return res.status(201).json({ message: 'Showroom registered successfully' });
    
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // For other users
    const user = await signup.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User with this email does not exist' });
// logic for admin
if(user.role=="admin"){
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
  
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
    expiresIn: '1h'
  });
     res.cookie('auth_token', token);
     return res.status(200).json({ message: 'Login successful', role: user.role });
     
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });
    
    // Generate token with user id and role
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, {
      expiresIn: '1h'
    });
    
    // Set the token in a cookie and return the role
    res.cookie('auth_token', token);
    return res.status(200).json({ message: 'Login successful', role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message, msg:"catch error" });
  }
};



// Forgot Password Logic
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await signup.findOne({email}); // Ensure you use the correct model

    if (!user) return res.status(404).json({ message: 'User not found test' });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex'); // Generate a random reset token
    user.resetPasswordToken = resetToken; // Store the plain token in the database
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    await user.save();

    // Send reset link via email
    const resetUrl = `${process.env.SITE_URL}/reset-password/${resetToken}`;
    const message = `Please click on the following link to reset your password: ${resetUrl}`;

    const transporter = nodemailer.createTransport({
      service: user,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: email,
      subject: 'Password Reset',
      text: message
    });

    res.status(200).json({ message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password Logic
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    // Find user by reset token
    const user = await signup.findOne({
      resetPasswordToken: token, // Assuming token is stored as plain in the database
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update user's password and reset token fields
    user.password = hashedPassword; // Set the hashed password
    user.resetPasswordToken = undefined; // Clear reset token
    user.resetPasswordExpires = undefined; // Clear expiration time
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//   this is just for testing purpose
  export const test=(req,res)=>{
    res.status(200).json({ message: 'Access granted', userId: req.user, role:req.role || "NO ROLE" });
  }