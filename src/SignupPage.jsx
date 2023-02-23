import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signup,setUserName,setNameError } from './Redux/Slices/UserSlice'

function SignupPage() {

  const {signupLoading,signupStatus,userName,nameErrorStatus} = useSelector(state =>state.user)
  const dispatch = useDispatch()

  let navigate = useNavigate()

  let nameError = "Name should contain only characters and numbers"
  let nameErrorEmpty = "Please provide a user name"

  const validateName = (value) =>{
    if(value.length === 0){
      dispatch(setUserName(value))
      if(! nameErrorStatus) dispatch(setNameError(true))
    }
    if(value.length > 0){
       let code = value.charCodeAt(value.length - 1)
        if(code === 32){
            let regexp = new RegExp(/^[\w]( ?[\w] ?)*$/)
    
            if(regexp.test(value)){
              dispatch(setUserName(value))
              if(nameErrorStatus) dispatch(setNameError(false))
            }
            
        }else{
            let regexp = new RegExp(/^[\w]( ?[\w] ?)*$/)
            if(regexp.test(value)){
              dispatch(setUserName(value))
              if(nameErrorStatus) dispatch(setNameError(false))
            }else{
              if(! nameErrorStatus) dispatch(setNameError(true))
            }
        }  
    }
  }

  useEffect(()=>{
   if(signupStatus) navigate("/")
  },[signupStatus])

  let formik = useFormik({
    initialValues : {
      email : "",
      password : ""
    },
    validate : (value) =>{
      let errors = {}
    
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

      return errors
    },
    onSubmit : (values) =>{
      values.name = userName
      dispatch(signup(values))
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
                        <label for="name" className='form-label'>User Name</label>
                        <input type="text" className="form-control" id="name"
                        onChange={(e)=>validateName(e.target.value)}
                        value={userName}/>
                        <span className='form-error'>{nameErrorStatus ? userName.length > 0 ? nameError : nameErrorEmpty:""}</span>
                    </div>
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
                    {
                      signupLoading ?
                      <div className="d-flex justify-content-center">
                      <button disabled className="btn btn-primary login-btn mt-3 pb-1 pt-2">
                      <div class="spinner-border text-white" style={{height:"20px",width:"20px"}} role="status"></div>
                      </button>
                      </div>
                      :
                      <div className="d-flex justify-content-center mt-3">
                      <button type='submit' disabled = {! formik.isValid} className="btn btn-primary login-btn">Sign up</button>
                      </div>
                    }
                    
            </form>
            </div>
            <h5 className='mt-3'>Already have an account? <Link to="/" className='link'>Sign in</Link></h5>
            </div>
        </div>
    </div>

    </div>
  )
}

export default SignupPage