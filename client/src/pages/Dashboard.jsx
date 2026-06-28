

const Dashboard = () => {
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

  return (
    <div style={styles}>
      <p>
        <b>
            Dashboard Service
        </b>
      </p>
    </div>
  )
}

export default Dashboard;