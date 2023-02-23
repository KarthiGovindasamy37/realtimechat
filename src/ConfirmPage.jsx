import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { resetPassword,setTempStatus } from './Redux/Slices/UserSlice'

function ConfirmPage() {

  const {resetLoading,resetStatus} = useSelector(state =>state.user)
  const dispatch = useDispatch()

  let navigate = useNavigate()

  useEffect(()=>{
    if(resetStatus) navigate("/portal")
  },[resetStatus])
  

  useEffect(() =>{
    dispatch(setTempStatus())
  },[])

    let formik = useFormik({
        initialValues : {
          email : "",
          password : "",
          confirmpass : ""
        },
        validate : (value) =>{
          let errors = {}
          if(value.name === ""){
            errors.name = "Please provide a user name"
          }
          if(value.email === ""){
            errors.email = "Please enter email id"
          }
          if(value.email.length > 0){
            let regex = new RegExp(/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/)
            if(!regex.test(value.email)) errors.email = "Please enter a valid email address"
          }
          if(value.password === ""){
            errors.password = "Please enter password"
          }
          if(value.password.length > 0){
            let regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{5,20}$/)
            if(!regex.test(value.password)) errors.password = "Password must contain atleast one uppercase, lowercase, special character and minimum 5, maximum 20 characters long"
          }
          if(value.confirmpass === ""){
            errors.confirmpass = "Please re enter your password"
          }
          if(value.confirmpass.length > 0 && value.password !== value.confirmpass){
            errors.confirmpass = "Password does not match"
          }
    
          return errors
        },
        onSubmit : (values) =>{
         dispatch(resetPassword(values))
        }
      })
      return (
        <div className='login-page'>
        <div className="d-flex">
            <div className="col-md-5 chatbot-div">
              <h1 className='chatbot-text'>LustigeZeit</h1>
            </div>
            <div className="col-md-7 login-div">
                <div className='col-md-5 ms-md-3'>
                    <div className="p-3 login-form shadow">
                <form onSubmit={formik.handleSubmit}>
                        <div className="mt-2">
                            <label for="email" className='form-label'>Email</label>
                            <input type="text" className="form-control" id="email"
                            name='email'
                            onChange={formik.handleChange}
                            value={formik.values.email}/>
                            <span className='form-error'>{formik.errors.email}</span>
                        </div>
                        <div className="mt-2">
                            <label for="password" className='form-label'>Password</label>
                            <input type="password" className="form-control" id="password"
                            name='password'
                            onChange={formik.handleChange}
                            value={formik.values.password}/>
                            <span className='form-error'>{formik.errors.password}</span>
                        </div>
                        <div className="mt-2">
                            <label for="password" className='form-label'>Re enter password</label>
                            <input type="password" className="form-control" id="password"
                            name='confirmpass'
                            onChange={formik.handleChange}
                            value={formik.values.confirmpass}/>
                            <span className='form-error'>{formik.errors.confirmpass}</span>
                        </div>
                        {
                      resetLoading ?
                      <div className="d-flex justify-content-center">
                      <button disabled className="btn btn-primary login-btn mt-3 pb-1 pt-2">
                      <div class="spinner-border text-white" style={{height:"20px",width:"20px"}} role="status"></div>
                      </button>
                      </div>
                      :
                        <div className="d-flex justify-content-center mt-3">
                            <button type='submit' disabled = {! formik.isValid} className="btn btn-primary login-btn">Submit</button>
                        </div>
                       }
                </form>
                </div>
                </div>
            </div>
        </div>
    
        </div>
  )
}

export default ConfirmPage