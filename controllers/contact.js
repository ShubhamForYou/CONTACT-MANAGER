const asyncHandler = require("express-async-handler");
const contactModel = require("../models/contact");

const getAllContacts = asyncHandler(async (req, res) => {
  const contactAll = await contactModel.find({ createdBy: req.user.id });
  res.status(200).json(contactAll);
});

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields mandatory !");
  }
  const contact = await contactModel.create({
    name,
    email,
    phone,
    createdBy: req.user.id,
  });
  res
    .status(201)
    .json({ msg: "new contact created successfully for", contact });
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await contactModel.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found ");
  }
  if (req.user.id !== contact.createdBy.toString()) {
    res.status(403);
    throw new Error("user is not authorized to get this contact");
  }
  res
    .status(200)
    .json({ msg: `get contact for ID: ${req.params.id} is`, contact });
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await contactModel.findById(req.params.id);
  if (!contact) {
    req.status(404);
    throw new Error("Contact not found ");
  }
  if (req.user.id !== contact.createdBy.toString()) {
    res.status(403);
    throw new Error("user is not authorized to edit this contact");
  }
  const updatedContact = await contactModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json({
    msg: `contact updated for ID: ${req.params.id} successfully`,
    updateContact: updatedContact,
  });
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await contactModel.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("contact not found");
  }
  if (req.user.id !== contact.createdBy.toString()) {
    res.status(403);
    throw new Error("user is not authorized to delete this ");
  }
  await contactModel.findByIdAndDelete(req.params.id);
  res.status(200).json({ msg: `contact deleted for ID: ${req.params.id}` });
});
module.exports = {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
