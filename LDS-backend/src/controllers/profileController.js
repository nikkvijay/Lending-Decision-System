const { AppError } = require('../middleware/errorMiddleware')
const profileService = require('../services/profileService')

const createProfile = async (req, res, next) => {
  try {
    const profile = await profileService.createProfile(req.body)
    res.status(201).json({ success: true, data: profile })
  } catch (err) {
    next(err)
  }
}

const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileById(req.params.id)
    if (!profile) throw new AppError('Profile not found', 404, 'PROFILE_NOT_FOUND')
    res.status(200).json({ success: true, data: profile })
  } catch (err) {
    next(err)
  }
}

module.exports = { createProfile, getProfile }
