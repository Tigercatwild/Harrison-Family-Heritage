'use client'

export default function ScriptureBar() {
  return (
    <>
      <style jsx>{`
        .scripture-link {
          color: #bfdbfe;
          text-decoration: underline;
          transition: color 0.3s ease, text-decoration 0.3s ease;
        }
        
        .scripture-link:hover {
          color: white;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .scripture-container {
            font-size: 14px !important;
          }
        }
      `}</style>
      
      <div style={{
        backgroundColor: '#1e3a8a', // Dark blue
        color: 'white',
        padding: '12px 16px',
        textAlign: 'center',
        borderBottom: '2px solid #1e40af',
        fontSize: '16px'
      }}>
        <p className="scripture-container" style={{
          color: '#dbeafe', // Light blue
          margin: '0',
          lineHeight: '1.4',
          fontSize: '16px'
        }}>
          <span style={{ fontWeight: 'bold' }}>
            &ldquo;Know ye therefore that they which are of faith, the same are the children of Abraham.&rdquo;
          </span>
          {' '}- {' '}
          <a 
            href="https://www.blueletterbible.org/kjv/gal/3/1/ss0/rl0/s_1094001" 
            target="_blank" 
            rel="noopener noreferrer"
            title="Read Galatians Chapter 3 on Blue Letter Bible"
            className="scripture-link"
            style={{ fontWeight: 'normal' }}
          >
            Galatians 3:7 (KJV)
          </a>
        </p>
      </div>
    </>
  );
}
