// src/components/V3Premium/AdvancedSearch.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaTimes, FaMicrophone, FaHistory, FaTrendingUp } from 'react-icons/fa'
import styles from './AdvancedSearch.module.css'

const AdvancedSearch = ({ data, onResultClick }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [trending, setTrending] = useState([
    'Android Developer',
    'Kotlin Projects',
    'Jetpack Compose',
    'Clean Architecture',
    'Firebase Integration'
  ])
  const searchRef = useRef(null)

  // Fuzzy search algorithm
  const fuzzySearch = (items, searchQuery) => {
    if (!searchQuery) return []

    const query = searchQuery.toLowerCase()
    
    return items
      .map(item => {
        let score = 0
        const title = item.title.toLowerCase()
        const description = item.description?.toLowerCase() || ''
        const tags = item.tags?.join(' ').toLowerCase() || ''
        
        // Exact match
        if (title.includes(query)) score += 100
        if (description.includes(query)) score += 50
        if (tags.includes(query)) score += 30
        
        // Word match
        const words = query.split(' ')
        words.forEach(word => {
          if (title.includes(word)) score += 20
          if (description.includes(word)) score += 10
        })
        
        // Character match
        let titleIndex = 0
        for (let char of query) {
          const charIndex = title.indexOf(char, titleIndex)
          if (charIndex !== -1) {
            score += 1
            titleIndex = charIndex + 1
          }
        }
        
        return { ...item, score }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }

  useEffect(() => {
    if (query.length > 2) {
      const searchResults = fuzzySearch(data, query)
      setResults(searchResults)
    } else {
      setResults([])
    }
  }, [query, data])

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery)
    if (searchQuery && !searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)])
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
  }

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      
      recognition.onstart = () => setIsListening(true)
      recognition.onend = () => setIsListening(false)
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        handleSearch(transcript)
      }
      
      recognition.start()
    } else {
      alert('Voice search is not supported in your browser')
    }
  }

  const highlightMatch = (text, query) => {
    if (!query) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={index}>{part}</mark> : part
    )
  }

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.searchBox}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search projects, skills, certificates..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className={styles.searchInput}
        />
        {query && (
          <button onClick={clearSearch} className={styles.clearBtn}>
            <FaTimes />
          </button>
        )}
        <button 
          onClick={startVoiceSearch} 
          className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
        >
          <FaMicrophone />
        </button>
      </div>

      <AnimatePresence>
        {(query || searchHistory.length > 0) && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {results.length > 0 ? (
              <>
                <div className={styles.section}>
                  <h4>Results</h4>
                  {results.map((result, index) => (
                    <motion.div
                      key={index}
                      className={styles.resultItem}
                      onClick={() => onResultClick && onResultClick(result)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 10 }}
                    >
                      <div className={styles.resultContent}>
                        <div className={styles.resultTitle}>
                          {highlightMatch(result.title, query)}
                        </div>
                        {result.description && (
                          <div className={styles.resultDesc}>
                            {highlightMatch(result.description, query)}
                          </div>
                        )}
                        {result.tags && (
                          <div className={styles.resultTags}>
                            {result.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className={styles.tag}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className={styles.resultScore}>
                        {Math.round(result.score)}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : query ? (
              <div className={styles.noResults}>
                <p>No results found for "{query}"</p>
                <p className={styles.suggestion}>Try different keywords</p>
              </div>
            ) : null}

            {searchHistory.length > 0 && !query && (
              <div className={styles.section}>
                <h4><FaHistory /> Recent Searches</h4>
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className={styles.historyItem}
                    onClick={() => handleSearch(item)}
                  >
                    <FaHistory />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {!query && (
              <div className={styles.section}>
                <h4><FaTrendingUp /> Trending</h4>
                {trending.map((item, index) => (
                  <div
                    key={index}
                    className={styles.trendingItem}
                    onClick={() => handleSearch(item)}
                  >
                    <FaTrendingUp />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdvancedSearch
