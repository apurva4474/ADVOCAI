import Contact from "../models/contact.js";

export const submitContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    res.status(201).json({ message: "Contact saved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
