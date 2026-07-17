> {
    const handleClick = (e) => {
      const newClick = {
        x: e.clientX,
        y: e.clientY + window.scrollY,
        timestamp: Date.now()
      }
      setClicks(prev => [...prev, newClick])
      
      // Store in localStorage
      const storedClicks = JSON.parse(localStorage.getItem('heatmapClicks') || '[]')
      localStorage.setItem('heatmapClicks', JSON.stringify([...storedClicks, newClick].slice(-1000)))
    }

    document.addEventListener('click', handleClick)
    
    // Load stored clicks
    const storedClicks = JSON.parse(localStorage.getItem('heatmapClicks') || '[]')
    setClicks(storedClicks)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !isVisible) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    canvas.width = document.documentElement.scrollWidth
    canvas.height = document.documentElement.scrollHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw heatmap
    clicks.forEach(click => {
      const gradient = ctx.createRadialGradient(click.x, click.y, 0, click.x, click.y, 50)
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.6)')
      gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.3)')
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)')

      ctx.fillStyle = gradient
      ctx.fillRect(click.x - 50, click.y - 50, 100, 100)
    })
  }, [clicks, isVisible])

  const toggleHeatmap = () => {
    setIsVisible(!isVisible)
  }

  const clearHeatmap = () => {
    setClicks([])
    localStorage.removeItem('heatmapClicks')
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`${styles.heatmap} ${isVisible ? styles.visible : ''}`}
      />

      <div className={styles.controls}>
        <motion.button
          className={styles.controlBtn}
          onClick={toggleHeatmap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isVisible ? 'Hide' : 'Show'} Heatmap
        </motion.button>
        <motion.button
          className={styles.controlBtn}
          onClick={clearHeatmap}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Clear Data
        </motion.button>
        <div className={styles.stats}>
          <span>Clicks: {clicks.length}</span>
        </div>
      </div>
    </>
  )
}

export default AdvancedHeatmap
