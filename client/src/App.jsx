

function App() {

  const styles =  {
    display: 'flex', 
    height: '100vh', 
    width: '100%', 
    justifyContent:'center', 
    alignItems:'center'
  }

  function loginUsingGit(){
    window.location.href = "http://localhost:3000/gitAuth/login"
  }

  return (
    <div style={styles}>
      <button
      onClick={()=> loginUsingGit()}>
          login using github
      </button>
    </div>
  )
}

export default App
