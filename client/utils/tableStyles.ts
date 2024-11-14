export const pageStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url(https://thecounter.org/wp-content/uploads/2022/02/worker-takes-customers-order-at-panda-express-garden-grove-CA-Nov-17-2021-1.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    overflow: 'hidden',
  };
  
  export const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 50% black overlay to dim background
  };
  
  export const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    width: '90%',
    maxWidth: '1100px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    position: 'relative',
    zIndex: 2,
    overflowY: 'auto',
    maxHeight: '80vh',
  };
  
  export const headingStyle: React.CSSProperties = {
    fontSize: '24px',
    color: '#D32F2F',
    marginBottom: '20px',
  };
  
  export const tableHeaderStyle: React.CSSProperties = {
    padding: '12px',
    backgroundColor: '#D32F2F',
    color: '#FFFFFF',
    textAlign: 'left',
    fontWeight: 'bold',
  };
  
  export const tableCellStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #dddddd',
  };
  
  export const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    backgroundColor: '#D32F2F',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    zIndex: 2,
  };

  export const inputStyle: React.CSSProperties = {
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #cccccc',
  };