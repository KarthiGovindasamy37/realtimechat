import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { temporary } from './Redux/Slices/UserSlice'

function TemporaryPage() {

    const {tempLoading,tempStatus} = useSelector(state =>state.user)
    const dispatch = useDispatch()

    let navigate = useNavigate()

    useEffect(()=>{
      if(tempStatus) navigate("/confirm")
    },[tempStatus])

    let formik = useFormik({
        initialValues:{
            email:"",
            password:""  
        },
    
       validate:(values)=>{
            let errors={}
    
            if(values.email===""){
                errors.email="Please enter email id"
            } 
            if(values.email.length > 0){
                let regex = new RegExp(/^[a-zA-Z0-9_]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/)
                if(!regex.test(values.email)) errors.email = "Please enter a valid email address"
            }
            if(values.password===""){
                errors.password="Please enter password"
            }
            return errors;
        },
        onSubmit:(values)=>{
          dispatch(temporary(values))
        }
    })
  return (
    <div className='login-page'>
        <div className="d-flex flex-wrap">
            <div className="col-md-5 chatbot-div">
              <h1 className='chatbot-text'>LustigeZeit</h1>
            </div>
            <div className="col-md-7 login-div ps-2 pe-2">
                <div className='col-md-5 ms-md-3'>
                    
                <div className="p-3 login-form shadow">
                <form onSubmit={formik.handleSubmit}>
                        <div className="mt-2">
                            <label for="email" className='form-label'>Email</label>
                            <input type="email" className="form-control" id="email"
                            name='email'
                            onChange={formik.handleChange}
                            value={formik.values.email}/>
                            <span className='form-error'>{formik.errors.email}</span>
                        </div>
                        <div className="mt-2">
                            <label for="password" className='form-label'>Temporary Password</label>
                            <input type="password" className="form-control" id="password"
                            name='password'
                            onChange={formik.handleChange}
                            value={formik.values.password}/>
                            <span className='form-error'>{formik.errors.password}</span>
                        </div>
                        {
                      tempLoading ?
                      <div className="d-flex justify-content-center">
                      <button disabled className="btn btn-primary login-btn mt-3 pb-1 pt-2">
                      <div class="spinner-border text-white" style={{height:"20px",width:"20px"}} role="status"></div>
                      </button>
                      </div>
                      :
                        <div className="d-flex justify-content-center mt-3">
                            <button type='submit' disabled={!formik.isValid} className="btn btn-primary login-btn">Submit</button>
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

export default TemporaryPage