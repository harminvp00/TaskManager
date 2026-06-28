

const Login = () => {

  const styles =  {
    display: 'flex', 
    flexDirection: 'column',
    gap: '10px',
    height: '100vh', 
    width: '100%', 
    justifyContent:'center', 
    alignItems:'center'
  }

  function loginUsingGit(){
    window.location.href = "http://localhost:3000/gitAuth/login"
  }

   function loginUsingGoogle(){
    window.location.href = "http://localhost:3000/googleAuth/login"
  }

  

  return (
    <div style={styles}>
      <button
      onClick={()=> loginUsingGit()}>
          login using github
      </button>

       <button
      onClick={()=> loginUsingGoogle()}>
          login using google
      </button>
    </div>
  )
}

export default Login;
