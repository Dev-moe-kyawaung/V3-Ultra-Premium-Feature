// src/components/V3Premium/BlockchainCertificates.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaShieldAlt, FaCheck, FaDownload, FaShareAlt } from 'react-icons/fa'
import QRCode from 'qrcode.react'
import styles from './BlockchainCertificates.module.css'

const BlockchainCertificates = ({ certificate }) => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState(null)

  // Simulate blockchain verification
  const verifyCertificate = async () => {
    setIsVerifying(true)
    
    // Simulate API call to blockchain
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock hash
    const hash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    
    setVerificationStatus({
      verified: true,
      hash: hash,
      timestamp: new Date().toISOString(),
      blockNumber: Math.floor(Math.random() * 1000000)
    })
    
    setIsVerifying(false)
  }

  const generateCertificateURL = () => {
    return `https://verify.moekyawaung.dev/cert/${certificate.id}`
  }

  return (
    <div className={styles.blockchainCert}>
      <div className={styles.certHeader}>
        <FaShieldAlt className={styles.shieldIcon} />
        <div>
          <h3>Blockchain Verified Certificate</h3>
          <p>Immutable and tamper-proof certification</p>
        </div>
      </div>

      <div className={styles.certInfo}>
        <div className={styles.infoRow}>
          <span className={styles.label}>Certificate ID:</span>
          <span className={styles.value}>{certificate.id}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Issued By:</span>
          <span className={styles.value}>{certificate.issuer}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>Date Issued:</span>
          <span className={styles.value}>{certificate.date}</span>
        </div>
      </div>

      <div className={styles.qrSection}>
        <QRCode 
          value={generateCertificateURL()} 
          size={150}
          bgColor="#0a0a0f"
          fgColor="#00f0ff"
          level="H"
        />
        <p>Scan to verify on blockchain</p>
      </div>

      {!verificationStatus && (
        <motion.button
          className={styles.verifyBtn}
          onClick={verifyCertificate}
          disabled={isVerifying}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isVerifying ? (
            <>
              <div className={styles.spinner} />
              Verifying on Blockchain...
            </>
          ) : (
            <>
              <FaShieldAlt /> Verify Certificate
            </>
          )}
        </motion.button>
      )}

      {verificationStatus && (
        <motion.div
          className={styles.verificationResult}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.resultHeader}>
            <FaCheck className={styles.checkIcon} />
            <h4>Certificate Verified!</h4>
          </div>
          
          <div className={styles.blockchainInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Transaction Hash:</span>
              <span className={styles.hash}>{verificationStatus.hash}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Block Number:</span>
              <span className={styles.value}>{verificationStatus.blockNumber}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Timestamp:</span>
              <span className={styles.value}>
                {new Date(verificationStatus.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <FaDownload /> Download Proof
            </button>
            <button className={styles.actionBtn}>
              <FaShareAlt /> Share Verification
            </button>
          </div>
        </motion.div>
      )}

      <div className={styles.blockchainBadge}>
        <span>🔗 Secured by Blockchain</span>
      </div>
    </div>
  )
}

export default BlockchainCertificates

