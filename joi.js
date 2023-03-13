
const Joi=require('joi')

const JoiSchema=Joi.object({
        username:Joi.string()
        .min(5)
        .max(30)
        .required(),

        email:Joi.string()
        .email()
        .min(5)
        .max(50)
        .optional(),

        password:Joi.string().required().min(6),
        confirm_password:Joi.string().required().min(6)

       
})

module.exports={
    JoiSchema
}

