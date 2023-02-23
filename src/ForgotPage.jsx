import { useFormik } from 'formik'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { forgot } from './Redux/Slices/UserSlice'

function ForgotPage() {

  const {forgotLoading} = useSelector(state =>state.user)
  const dispatch = useDispatch()

    let formik = useFormik({
        initialValues:{
            email:"" 
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
            return errors;
        },
        onSubmit:(values)=>{
          dispatch(forgot(values))
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
                        {
                      forgotLoading ?
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
                        <div className="d-flex justify-content-end pt-3">
                          <Link to="/temporary" className='link'>Temporary Password</Link>
                        </div>
                </form>
                </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ForgotPage