// src/components/V3Premium/AICodeAssistant.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaRobot, FaCode, FaPaperPlane, FaTimes, FaDownload, FaCopy } from 'react-icons/fa'
import styles from './AICodeAssistant.module.css'

const AICodeAssistant = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hi! I'm your AI code assistant. Ask me anything about Android development, Kotlin, or my projects!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions] = useState([
    "Show me your best Android projects",
    "How do you implement MVVM architecture?",
    "Tell me about Clean Architecture",
    "What's your experience with Jetpack Compose?",
    "Show code examples for Firebase integration"
  ])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userInput) => {
    const input = userInput.toLowerCase()
    
    // Advanced response logic with code examples
    if (input.includes('mvvm') || input.includes('architecture')) {
      return {
        text: "Here's how I implement MVVM architecture in Android:",
        code: `// ViewModel
class UserViewModel : ViewModel() {
    private val _users = MutableLiveData<List<User>>()
    val users: LiveData<List<User>> = _users
    
    private val repository = UserRepository()
    
    fun fetchUsers() {
        viewModelScope.launch {
            _users.value = repository.getUsers()
        }
    }
}

// Activity/Fragment
class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        viewModel.users.observe(this) { users ->
            // Update UI
        }
        
        viewModel.fetchUsers()
    }
}`,
        language: 'kotlin'
      }
    }
    
    if (input.includes('compose') || input.includes('jetpack compose')) {
      return {
        text: "Here's a Jetpack Compose example I frequently use:",
        code: `@Composable
fun UserProfile(user: User) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = 4.dp
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            AsyncImage(
                model = user.avatarUrl,
                contentDescription = "Profile picture",
                modifier = Modifier
                    .size(64.dp)
                    .clip(CircleShape)
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column {
                Text(
                    text = user.name,
                    style = MaterialTheme.typography.h6
                )
                Text(
                    text = user.email,
                    style = MaterialTheme.typography.body2
                )
            }
        }
    }
}`,
        language: 'kotlin'
      }
    }
    
    if (input.includes('firebase')) {
      return {
        text: "Here's my Firebase integration pattern:",
        code: `class FirebaseRepository {
    private val db = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()
    
    suspend fun getUser(userId: String): User? {
        return try {
            db.collection("users")
                .document(userId)
                .get()
                .await()
                .toObject(User::class.java)
        } catch (e: Exception) {
            Log.e("Firebase", "Error getting user", e)
            null
        }
    }
    
    fun observeUser(userId: String): Flow<User?> = callbackFlow {
        val listener = db.collection("users")
            .document(userId)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                trySend(snapshot?.toObject(User::class.java))
            }
        
        awaitClose { listener.remove() }
    }
}`,
        language: 'kotlin'
      }
    }
    
    if (input.includes('clean architecture')) {
      return {
        text: "My Clean Architecture implementation follows these layers:",
        code: `// Domain Layer - Use Case
class GetUserUseCase(
    private val repository: UserRepository
) {
    suspend operator fun invoke(userId: String): Result<User> {
        return try {
            val user = repository.getUser(userId)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}

// Data Layer - Repository Implementation
class UserRepositoryImpl(
    private val remoteDataSource: UserRemoteDataSource,
    private val localDataSource: UserLocalDataSource
) : UserRepository {
    override suspend fun getUser(userId: String): User {
        return try {
            val remoteUser = remoteDataSource.fetchUser(userId)
            localDataSource.saveUser(remoteUser)
            remoteUser
        } catch (e: Exception) {
            localDataSource.getUser(userId)
        }
    }
}

// Presentation Layer - ViewModel
class UserViewModel(
    private val getUserUseCase: GetUserUseCase
) : ViewModel() {
    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState = _uiState.asStateFlow()
    
    fun loadUser(userId: String) {
        viewModelScope.launch {
            getUserUseCase(userId)
                .onSuccess { user ->
                    _uiState.value = UiState.Success(user)
                }
                .onFailure { error ->
                    _uiState.value = UiState.Error(error.message)
                }
        }
    }
}`,
        language: 'kotlin'
      }
    }
    
    if (input.includes('project') || input.includes('portfolio')) {
      return {
        text: "I've built 3000+ applications! Here are some highlights:\n\n" +
              "• Social Dashboard - Real-time analytics platform\n" +
              "• POS System - Complete point-of-sale solution\n" +
              "• Video Player - Custom media player with advanced features\n" +
              "• Job Portal - Full-stack job marketplace\n" +
              "• Game Collection - Interactive browser games\n\n" +
              "Visit my Projects page to see detailed case studies!"
      }
    }
    
    if (input.includes('experience') || input.includes('skills')) {
      return {
        text: "I have 10+ years of Android development experience:\n\n" +
              "🎯 Core Skills:\n" +
              "• Kotlin (95% proficiency)\n" +
              "• Jetpack Compose (90%)\n" +
              "• Firebase (88%)\n" +
              "• MVVM & Clean Architecture\n" +
              "• CI/CD with GitHub Actions\n\n" +
              "🏆 Achievements:\n" +
              "• 82+ Professional Certifications\n" +
              "• 3000+ Apps Developed\n" +
              "• 122+ GitHub Repositories\n" +
              "• 100% Client Satisfaction"
      }
    }
    
    if (input.includes('coroutine') || input.includes('async')) {
      return {
        text: "Here's my approach to handling async operations with Coroutines:",
        code: `class DataRepository {
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO
    )
    
    // Sequential operations
    suspend fun loadUserData(userId: String): UserData {
        val user = fetchUser(userId)
        val posts = fetchUserPosts(userId)
        val friends = fetchUserFriends(userId)
        return UserData(user, posts, friends)
    }
    
    // Parallel operations
    suspend fun loadDashboard(userId: String): Dashboard {
        return coroutineScope {
            val userDeferred = async { fetchUser(userId) }
            val statsDeferred = async { fetchStats(userId) }
            val notificationsDeferred = async { fetchNotifications(userId) }
            
            Dashboard(
                user = userDeferred.await(),
                stats = statsDeferred.await(),
                notifications = notificationsDeferred.await()
            )
        }
    }
    
    // Flow for real-time updates
    fun observeUserStatus(userId: String): Flow<UserStatus> = flow {
        while (true) {
            val status = fetchUserStatus(userId)
            emit(status)
            delay(5000) // Poll every 5 seconds
        }
    }.flowOn(Dispatchers.IO)
}`,
        language: 'kotlin'
      }
    }
    
    return {
      text: "That's an interesting question! While I don't have a specific example for that, " +
            "I'd be happy to discuss:\n\n" +
            "• My Android development approach\n" +
            "• Specific technologies I use\n" +
            "• Architecture patterns I follow\n" +
            "• Projects I've worked on\n\n" +
            "Try asking about MVVM, Clean Architecture, Jetpack Compose, or Firebase!"
    }
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = generateAIResponse(input)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.text || response,
        code: response.code,
        language: response.language,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleSuggestion = (suggestion) => {
    setInput(suggestion)
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    alert('Code copied to clipboard!')
  }

  const downloadCode = (code, language) => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `example.${language === 'kotlin' ? 'kt' : 'java'}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.assistant}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.header}>
              <div className={styles.headerInfo}>
                <FaRobot className={styles.headerIcon} />
                <div>
                  <h4>AI Code Assistant</h4>
                  <p>Powered by Advanced AI</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
                <FaTimes />
              </button>
            </div>

            <div className={styles.messages}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`${styles.message} ${styles[message.type]}`}
                  initial={{ opacity: 0, x: message.type === 'user' ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.messageContent}>
                    <p>{message.content}</p>
                    
                    {message.code && (
                      <div className={styles.codeBlock}>
                        <div className={styles.codeHeader}>
                          <span>{message.language}</span>
                          <div className={styles.codeActions}>
                            <button onClick={() => copyCode(message.code)}>
                              <FaCopy /> Copy
                            </button>
                            <button onClick={() => downloadCode(message.code, message.language)}>
                              <FaDownload /> Download
                            </button>
                          </div>
                        </div>
                        <pre>
                          <code>{message.code}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                  <div className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className={`${styles.message} ${styles.bot}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.messageContent}>
                    <div className={styles.typingIndicator}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className={styles.suggestions}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionBtn}
                  onClick={() => handleSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className={styles.inputArea}>
              <input
                type="text"
                placeholder="Ask about Android development..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend} className={styles.sendBtn}>
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaCode />
        <span className={styles.badge}>AI</span>
      </motion.button>
    </>
  )
}

export default AICodeAssistant
