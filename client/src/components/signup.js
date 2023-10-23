import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  function validateEmail(email) {
    // Define a regular expression pattern for the desired format
    const emailPattern = /@moderncoe\.edu\.in$/;

    // Use the test method to check if the email matches the pattern
    return emailPattern.test(email);
  }

  const [credentials, setCredentials] = useState({ firstname: "", Branch: "", email: "", password: "", AdmissionYear:"" })

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateEmail(credentials.email)) {
      try {
        const response = await fetch("http://localhost:5000/api/auth/createUser", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ firstname: credentials.firstname, Branch: credentials.Branch, email: credentials.email, password: credentials.password, AdmissionYear:credentials.AdmissionYear })
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success) {
            // Save the auth token
            localStorage.setItem('token', json.authToken);
            console.log(json);
            navigate('/Home');
          } else {
            alert("Invalid Credentials");
          }
        } else {
          // Handle non-successful response (e.g., 4xx or 5xx status)
          alert("Request failed with status: " + response.status);
        }
      } catch (error) {
        console.error('Error:', error);
        alert("An error occurred while processing your request");
      }
    } else {
      alert("Email is not valid");
    }
  };






  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  return (
    <>

      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstname" className="form-label">Enter Your First Name</label>
            <input type="text" className="form-control" id="firstname" name='firstname' value={credentials.firstname} onChange={onChange} />
          </div>
          <div className="mb-3">
           <div className='col'>
           <label htmlFor="AdmissionYear" className="form-label">Year of Admission in First Year</label>
            <input type="text" className="form-control" id="AdmissionYear" name='AdmissionYear' value={credentials.AdmissionYear} onChange={onChange} required maxLength={4}/>
          
           </div>

           <div className='col'>
           <label htmlFor="Branch" className="form-label">Select the Department </label>
            <select className="form-select" value={credentials.Branch} onChange={onChange} name="Branch" id="Branch">
              <option value="">Select an option</option>
              <option value="MCA">MCA</option>
              <option value="CS">CS</option>
              <option value="IT">IT</option>
              <option value="AIDS">AIDS</option>
              <option value="AIML">AIML</option>
              <option value="ENTC">ENTC</option>
              <option value="Electrical">Electrical</option>
              <option value="Mechanical">Mechanical</option>
            </select>

           </div>
             
             
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" name='email' value={credentials.email} onChange={onChange} />

          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" onChange={onChange} name='password' value={credentials.password} required minLength={5} />
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form >
      </div >
    </>
  )
}

export default Signup
