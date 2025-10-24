import mongoose from 'mongoose';
const complaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    isAnonymous: { type: Boolean, default: false },

    // optional user reference (null if anonymous)
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String },       // stored display name (could be 'Anonymous' if requested)
    email: { type: String },      // optional for contact
    rollNo: { type: String },

    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;