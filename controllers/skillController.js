const Skill = require("../models/Skill");

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find({ userId: req.user._id }).sort({ order: 1, createdAt: -1 });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
};

const createSkill = async (req, res) => {
    try {
        const skill = new Skill({ ...req.body, userId: req.user._id });
        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ message: 'Error creating skill', error: error.message });
    }
};

const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { 
                new: true, 
                runValidators: true 
            }
        );
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found or you do not have permission to update it' });
        }
        res.json(skill);
    } catch (error) {
        res.status(400).json({ message: 'Error updating skill', error: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found or you do not have permission to delete it' });
        }
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting skill', error: error.message });
    }
};

module.exports = { 
    getSkills, 
    createSkill, 
    updateSkill, 
    deleteSkill 
};
