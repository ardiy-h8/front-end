import React from 'react';
import MarkerBar from './MarkerBar'
const styles = {
    container: {
        position: 'absolute',
        bottom: '5rem',
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: 'auto auto',
    },
    content: {
        display: 'inline-block',
        maxWidth: 200,
        fontWeight: 'bold',
        fontSize: '1.5rem',
        padding: 10,
        marginBottom: 60
    }
};

export default () => (
    <div style={styles.container}>
        <div style={styles.content}>
            <MarkerBar/>
        </div>
        <p style={{color:'white'}}>Looking for marker...</p>
    </div>
);
