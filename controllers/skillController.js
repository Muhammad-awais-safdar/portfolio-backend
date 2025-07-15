const Skill = require("../models/Skill");

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find().sort({ order: 1, createdAt: -1 });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching skills', error: error.message });
    }
};

const createSkill = async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ message: 'Error creating skill', error: error.message });
    }
};

const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }
        res.json(skill);
    } catch (error) {
        res.status(400).json({ message: 'Error updating skill', error: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
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
