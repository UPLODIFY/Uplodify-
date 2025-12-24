// app.js - UI Logic for Uplodify
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== SECTION MANAGEMENT =====
    const allSections = document.querySelectorAll('section');
    const bottomNavButtons = document.querySelectorAll('.bottom-nav button');
    
    // Show specific section, hide all others
    function showSection(sectionId) {
        console.log('Switching to section:', sectionId);
        
        // Hide all sections
        allSections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        
        // Update bottom nav active state
        updateNavActiveState(sectionId);
    }
    
    // Update bottom nav active state
    function updateNavActiveState(sectionId) {
        bottomNavButtons.forEach(btn => {
            btn.classList.remove('nav-active');
        });
        
        // Map section IDs to nav button IDs
        const navMap = {
            'homeSection': 'navHome',
            'uploadSection': 'navUpload',
            'aiSection': 'navAI',
            'groupSection': 'navGroup',
            'profileSection': 'navProfile'
        };
        
        const navButtonId = navMap[sectionId];
        if (navButtonId) {
            const navBtn = document.getElementById(navButtonId);
            if (navBtn) {
                navBtn.classList.add('nav-active');
            }
        }
    }
    
    // ===== INITIAL SETUP =====
    // Show login section by default
    showSection('loginSection');
    
    // ===== LOGIN/REGISTER NAVIGATION =====
    document.getElementById('goRegisterBtn')?.addEventListener('click', function() {
        showSection('registerSection');
    });
    
    document.getElementById('goLoginBtn')?.addEventListener('click', function() {
        showSection('loginSection');
    });
    
    document.getElementById('goForgotBtn')?.addEventListener('click', function() {
        alert('Password reset feature will be implemented soon.');
    });
    
    // ===== LOGIN BUTTON (UI Only) =====
    document.getElementById('loginBtn')?.addEventListener('click', function() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }
        
        // UI feedback
        this.textContent = 'Logging in...';
        this.disabled = true;
        
        // Simulate login process (actual auth in firebase.js)
        setTimeout(() => {
            showSection('permissionSection');
            this.textContent = 'Login';
            this.disabled = false;
        }, 1000);
    });
    
    // ===== REGISTER BUTTON (UI Only) =====
    document.getElementById('registerBtn')?.addEventListener('click', function() {
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (!email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }
        
        // UI feedback
        this.textContent = 'Creating Account...';
        this.disabled = true;
        
        // Simulate registration process (actual auth in firebase.js)
        setTimeout(() => {
            showSection('permissionSection');
            this.textContent = 'Sign Up';
            this.disabled = false;
        }, 1000);
    });
    
    // ===== PERMISSION SECTION =====
    document.getElementById('allowNotificationBtn')?.addEventListener('click', function() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    alert('Notifications enabled!');
                    this.textContent = '✓ Enabled';
                    this.style.background = '#10B981';
                } else {
                    alert('Notifications blocked. You can enable them later in settings.');
                    this.textContent = '✗ Blocked';
                    this.style.background = '#6B7280';
                }
            });
        } else {
            alert('Your browser does not support notifications.');
        }
    });
    
    document.getElementById('allowMediaBtn')?.addEventListener('click', function() {
        // Enable video input
        const videoInput = document.getElementById('videoInput');
        if (videoInput) {
            videoInput.disabled = false;
            alert('Media access enabled! You can now upload videos.');
            this.textContent = '✓ Enabled';
            this.style.background = '#10B981';
        }
    });
    
    document.getElementById('continueBtn')?.addEventListener('click', function() {
        showSection('homeSection');
        initializeHomeStats();
    });
    
    // ===== BOTTOM NAVIGATION =====
    document.getElementById('navHome')?.addEventListener('click', function() {
        showSection('homeSection');
        initializeHomeStats();
    });
    
    document.getElementById('navUpload')?.addEventListener('click', function() {
        showSection('uploadSection');
    });
    
    document.getElementById('navAI')?.addEventListener('click', function() {
        showSection('aiSection');
    });
    
    document.getElementById('navGroup')?.addEventListener('click', function() {
        showSection('groupSection');
        initializeGroupVideos();
    });
    
    document.getElementById('navProfile')?.addEventListener('click', function() {
        showSection('profileSection');
    });
    
    // ===== UPLOAD SECTION LOGIC =====
    document.getElementById('generateCaptionBtn')?.addEventListener('click', function() {
        generateAICaption();
    });
    
    document.getElementById('openUploadPageBtn')?.addEventListener('click', function() {
        openPlatformUploadPage();
    });
    
    document.getElementById('backHomeFromUpload')?.addEventListener('click', function() {
        showSection('homeSection');
    });
    
    // ===== AI SECTION LOGIC =====
    document.getElementById('sendAiMsgBtn')?.addEventListener('click', function() {
        const userInput = document.getElementById('aiUserInput').value;
        if (!userInput.trim()) {
            alert('Please enter a message for the AI.');
            return;
        }
        
        // Simulate AI thinking
        this.textContent = 'Thinking...';
        this.disabled = true;
        
        setTimeout(() => {
            const responses = [
                "Based on your content, I recommend using trending hashtags related to your niche.",
                "Your video length is perfect for engagement! Try adding a call-to-action in the first 5 seconds.",
                "For better reach, consider posting during peak hours (6-9 PM local time).",
                "I suggest using 3-5 relevant hashtags and keeping your caption under 150 characters.",
                "Your content would perform well with some background music. Try using trending audio."
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            alert(`AI Response: ${randomResponse}`);
            
            this.textContent = 'Send';
            this.disabled = false;
            document.getElementById('aiUserInput').value = '';
        }, 1500);
    });
    
    document.getElementById('backHomeFromAI')?.addEventListener('click', function() {
        showSection('homeSection');
    });
    
    // ===== GROUP SECTION LOGIC =====
    let groupRulesAccepted = false;
    
    document.getElementById('acceptGroupRuleBtn')?.addEventListener('click', function() {
        groupRulesAccepted = true;
        document.getElementById('groupWarning').style.display = 'none';
        document.getElementById('groupVideoList').style.display = 'block';
        loadGroupVideos();
    });
    
    document.getElementById('backHomeFromGroup')?.addEventListener('click', function() {
        showSection('homeSection');
    });
    
    // ===== PROFILE SECTION LOGIC =====
    document.getElementById('editProfileBtn')?.addEventListener('click', function() {
        alert('Edit Profile feature will be available soon.');
    });
    
    document.getElementById('connectionsBtn')?.addEventListener('click', function() {
        alert('Connections feature will be available soon.');
    });
    
    document.getElementById('uploadHistoryBtn')?.addEventListener('click', function() {
        alert('Upload History feature will be available soon.');
    });
    
    document.getElementById('privacyBtn')?.addEventListener('click', function() {
        alert('Privacy Settings feature will be available soon.');
    });
    
    // ===== HELPER FUNCTIONS =====
    
    // Initialize home page stats
    function initializeHomeStats() {
        // Simulate loading stats
        setTimeout(() => {
            const stats = {
                'totalVideosCard': Math.floor(Math.random() * 50) + 10,
                'lastVideoViewsCard': Math.floor(Math.random() * 10000) + 1000,
                'sevenDaysViewsCard': Math.floor(Math.random() * 50000) + 5000,
                'totalViewsCard': Math.floor(Math.random() * 200000) + 10000
            };
            
            Object.entries(stats).forEach(([cardId, value]) => {
                const card = document.getElementById(cardId);
                if (card) {
                    const statValue = card.querySelector('.stat-value');
                    if (statValue) {
                        // Format numbers with commas
                        statValue.textContent = value.toLocaleString();
                    }
                }
            });
        }, 300);
    }
    
    // Generate AI caption for video
    function generateAICaption() {
        const videoInput = document.getElementById('videoInput');
        const platformSelect = document.getElementById('platformSelect');
        const captionBox = document.getElementById('captionBox');
        
        if (!videoInput.files || videoInput.files.length === 0) {
            alert('Please select a video file first.');
            return;
        }
        
        const videoFile = videoInput.files[0];
        const platform = platformSelect.value;
        
        // Get video duration (simulated)
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            
            const duration = video.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            
            // Create AI prompt
            const prompt = `Create engaging caption for a ${minutes}:${seconds.toString().padStart(2, '0')} video uploaded to ${platform}. 
            Video filename: ${videoFile.name}. 
            File size: ${(videoFile.size / (1024 * 1024)).toFixed(2)} MB.
            Include relevant hashtags and a call-to-action.`;
            
            // Simulate AI response
            const aiResponse = generateCaptionResponse(videoFile.name, platform, minutes, seconds);
            
            // Fill caption box
            captionBox.value = aiResponse;
            
            // Change button to indicate success
            const generateBtn = document.getElementById('generateCaptionBtn');
            generateBtn.textContent = '✓ Caption Generated';
            generateBtn.style.background = '#10B981';
            
            setTimeout(() => {
                generateBtn.textContent = 'Generate Caption';
                generateBtn.style.background = '';
            }, 2000);
        };
        
        video.src = URL.createObjectURL(videoFile);
    }
    
    // Generate caption response based on platform
    function generateCaptionResponse(filename, platform, minutes, seconds) {
        const hashtags = {
            'youtube': '#YouTube #ContentCreator #Video #Subscribe #YouTuber',
            'tiktok': '#TikTok #FYP #ForYou #Viral #Trending #FYPシ',
            'instagram': '#Instagram #Reels #InstaVideo #Explore #Trending'
        };
        
        const platforms = {
            'youtube': 'YouTube',
            'tiktok': 'TikTok',
            'instagram': 'Instagram'
        };
        
        const platformName = platforms[platform] || platform;
        const platformHashtags = hashtags[platform] || '#SocialMedia #VideoContent';
        
        const captions = [
            `🎬 New ${minutes}:${seconds.toString().padStart(2, '0')} video is live! Took me a while to create this one, but totally worth it!\n\nWhat's your favorite part? Let me know in the comments! 👇\n\n${platformHashtags}\n\n#${platformName}Creator #VideoContent`,
            
            `✨ Just dropped my latest creation! This ${minutes}min video was so much fun to make. Hope you enjoy it as much as I enjoyed creating it!\n\nDon't forget to like and share! 🔄\n\n${platformHashtags}\n\n#ContentCreation #DigitalCreator`,
            
            `🔥 NEW VIDEO ALERT! After ${minutes} minutes of pure content, this one's ready for you. Tap that like button if you're excited! 👍\n\nComment your thoughts below! 💬\n\n${platformHashtags}\n\n#${filename.split('.')[0]} #VideoEditing`
        ];
        
        return captions[Math.floor(Math.random() * captions.length)];
    }
    
    // Open platform-specific upload page
    function openPlatformUploadPage() {
        const platformSelect = document.getElementById('platformSelect');
        const platform = platformSelect.value;
        
        const urls = {
            'youtube': 'https://studio.youtube.com/',
            'instagram': 'https://www.instagram.com/',
            'tiktok': 'https://www.tiktok.com/upload'
        };
        
        const url = urls[platform];
        if (url) {
            window.open(url, '_blank');
            alert(`Opening ${platform} upload page in new tab. Please upload your video there.`);
        } else {
            alert(`Please manually go to ${platform}'s upload page.`);
        }
    }
    
    // Initialize group videos on first load
    function initializeGroupVideos() {
        if (!groupRulesAccepted) {
            document.getElementById('groupWarning').style.display = 'block';
            document.getElementById('groupVideoList').style.display = 'none';
        } else {
            document.getElementById('groupWarning').style.display = 'none';
            document.getElementById('groupVideoList').style.display = 'block';
            loadGroupVideos();
        }
    }
    
    // Load group videos (simulated)
    function loadGroupVideos() {
        const groupVideoList = document.getElementById('groupVideoList');
        if (!groupVideoList) return;
        
        // Clear existing videos
        groupVideoList.innerHTML = '';
        
        // Sample video data
        const videos = [
            { title: 'How to Grow on Social Media', creator: 'Alex Johnson', views: '15K', id: 'abc123' },
            { title: 'Video Editing Tips 2024', creator: 'Sarah Miller', views: '8.2K', id: 'def456' },
            { title: 'Content Creation Workflow', creator: 'Mike Chen', views: '12.5K', id: 'ghi789' },
            { title: 'Best Time to Post', creator: 'Emma Davis', views: '25K', id: 'jkl012' },
            { title: 'Engagement Hacks', creator: 'David Wilson', views: '7.3K', id: 'mno345' }
        ];
        
        videos.forEach((video, index) => {
            const videoItem = document.createElement('a');
            videoItem.href = `https://www.youtube.com/watch?v=${video.id}`;
            videoItem.target = '_blank';
            videoItem.className = 'group-video-item';
            videoItem.onclick = function(e) {
                alert(`Opening video: ${video.title}\nThis will open in a new tab.`);
            };
            
            videoItem.innerHTML = `
                <div class="video-thumb">VID ${index + 1}</div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                    <p>By ${video.creator} • ${video.views} views</p>
                </div>
            `;
            
            groupVideoList.appendChild(videoItem);
        });
    }
    
    // ===== GLOBAL EVENT LISTENERS =====
    
    // Video input change event
    document.getElementById('videoInput')?.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const fileName = this.files[0].name;
            console.log('Video selected:', fileName);
            
            // Update button text to show file is ready
            const generateBtn = document.getElementById('generateCaptionBtn');
            if (generateBtn) {
                generateBtn.disabled = false;
                generateBtn.textContent = `Generate Caption for "${fileName}"`;
            }
        }
    });
    
    // Platform select change event
    document.getElementById('platformSelect')?.addEventListener('change', function() {
        console.log('Platform changed to:', this.value);
    });
    
    // Initialize on first load
    initializeHomeStats();
    
    console.log('Uplodify app.js loaded successfully');
});
