document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userId = sessionStorage.getItem('userId');
    
    if (!isLoggedIn || !userId) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Set user information
    document.getElementById('userIdDisplay').textContent = userId;
    // Format username for display - capitalize first letter after 'sec'
    const displayName = userId.charAt(0).toUpperCase() + userId.slice(1, 3) + userId.charAt(3).toUpperCase() + userId.slice(4);
    document.getElementById('userGreeting').textContent = displayName;
    
    // Initialize dashboard data
    initializeDashboard();
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const userProfileMenu = document.getElementById('userProfileMenu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            userProfileMenu.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (userProfileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!userProfileMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                userProfileMenu.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Event listeners
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        // Clear session storage
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userId');
        // Redirect to login page
        window.location.href = 'login.html';
    });
    
    // Add click event to notification bell
    document.querySelector('.notifications').addEventListener('click', function() {
        alert('You have 3 new notifications about your recycling activities!');
    });
    
    // Eco tips button event listener
    if (document.getElementById('showTip')) {
        document.getElementById('showTip').addEventListener('click', showTipModal);
    }
    
    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Next tip button
    if (document.getElementById('nextTip')) {
        document.getElementById('nextTip').addEventListener('click', showNextTip);
    }
    
    // Refresh activity button
    if (document.getElementById('refreshActivity')) {
        document.getElementById('refreshActivity').addEventListener('click', refreshActivity);
    }
    
    // Reward modal action buttons
    if (document.getElementById('cancelRedemption')) {
        document.getElementById('cancelRedemption').addEventListener('click', function() {
            document.getElementById('rewardModal').classList.remove('active');
        });
    }
    
    if (document.getElementById('confirmRedemption')) {
        document.getElementById('confirmRedemption').addEventListener('click', confirmRewardRedemption);
    }
    
    // Footer links
    const footerLinks = ['aboutLink', 'helpLink', 'privacyLink', 'termsLink'];
    footerLinks.forEach(linkId => {
        if (document.getElementById(linkId)) {
            document.getElementById(linkId).addEventListener('click', function(e) {
                e.preventDefault();
                alert(`This would navigate to the ${linkId.replace('Link', '')} page.`);
            });
        }
    });
});

function initializeDashboard() {
    // Generate mock data for the user
    const userData = generateMockUserData();
    
    // Update dashboard stats
    updateDashboardStats(userData);
    
    // Update rank progress bar
    updateRankProgress(userData.totalCredits);
    
    // Populate recent activity
    populateRecentActivity(userData.recentActivity);
    
    // Populate rewards preview
    populateRewardsPreview(userData.availableRewards);
    
    // Populate achievements section
    populateAchievements(userData.achievements);
}

function generateMockUserData() {
    // Generate random credit amount between 50 and 500
    const totalCredits = Math.floor(Math.random() * 450) + 50;
    
    // Generate random waste amount between 2 and 20 kg
    const wasteDisposed = Math.floor(Math.random() * 18) + 2;
    
    // Determine rank based on credits
    let rank;
    if (totalCredits < 100) rank = 'Beginner';
    else if (totalCredits < 250) rank = 'Eco Helper';
    else if (totalCredits < 400) rank = 'Eco Warrior';
    else rank = 'Eco Champion';
    
    // Generate random active days between 1 and 14
    const activeDays = Math.floor(Math.random() * 14) + 1;
    
    // Generate recent activity
    const activityTypes = [
        { type: 'Plastic Bottles', icon: 'fa-bottle-water', credits: [5, 10] },
        { type: 'Paper Waste', icon: 'fa-newspaper', credits: [3, 8] },
        { type: 'Food Containers', icon: 'fa-utensils', credits: [4, 7] },
        { type: 'Aluminum Cans', icon: 'fa-trash', credits: [5, 10] }
    ];
    
    const recentActivity = [];
    for (let i = 0; i < 5; i++) {
        const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const hoursAgo = Math.floor(Math.random() * 24);
        const creditsEarned = Math.floor(Math.random() * 
            (randomActivity.credits[1] - randomActivity.credits[0] + 1)) + 
            randomActivity.credits[0];
        
        recentActivity.push({
            type: randomActivity.type,
            icon: randomActivity.icon,
            time: hoursAgo === 0 ? 'Just now' : `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`,
            credits: creditsEarned
        });
    }
    
    // Generate available rewards
    const availableRewards = [
        { 
            name: 'Cafeteria Voucher', 
            icon: 'fa-utensils', 
            cost: 50,
            description: 'Get a 10% discount voucher for your next purchase at the campus cafeteria.'
        },
        { 
            name: 'Print Credits', 
            icon: 'fa-print', 
            cost: 30,
            description: '50 extra printing pages added to your student account.'
        },
        { 
            name: 'Campus Store Discount', 
            icon: 'fa-store', 
            cost: 100,
            description: 'Get a 15% discount on any item at the campus store.'
        },
        { 
            name: 'Library Extension', 
            icon: 'fa-book', 
            cost: 25,
            description: 'Extend your book borrowing period by one week.' 
        }
    ];
    
    // Generate achievements based on credits and activity
    const achievements = [
        {
            name: 'First Recycle',
            icon: 'fa-award',
            description: 'Recycle your first item',
            earned: true
        },
        {
            name: 'Eco Starter',
            icon: 'fa-seedling',
            description: 'Earn 50 credits',
            earned: totalCredits >= 50
        },
        {
            name: 'Consistent Recycler',
            icon: 'fa-calendar-check',
            description: 'Active for 7 consecutive days',
            earned: activeDays >= 7
        },
        {
            name: 'Waste Warrior',
            icon: 'fa-dumpster',
            description: 'Recycle 10 kg of waste',
            earned: wasteDisposed >= 10
        },
        {
            name: 'Credit Collector',
            icon: 'fa-coins',
            description: 'Earn 200 credits total',
            earned: totalCredits >= 200
        },
        {
            name: 'Eco Champion',
            icon: 'fa-trophy',
            description: 'Reach the highest rank',
            earned: rank === 'Eco Champion'
        }
    ];
    
    return {
        totalCredits,
        wasteDisposed,
        rank,
        activeDays,
        recentActivity,
        availableRewards,
        achievements
    };
}

function updateDashboardStats(userData) {
    document.getElementById('totalCredits').textContent = userData.totalCredits;
    document.getElementById('wasteDisposed').textContent = `${userData.wasteDisposed} kg`;
    document.getElementById('userRank').textContent = userData.rank;
    document.getElementById('currentStreak').textContent = `${userData.activeDays} day${userData.activeDays === 1 ? '' : 's'}`;
    
    // Update the available credits display if it exists
    if (document.getElementById('availableCredits')) {
        document.getElementById('availableCredits').textContent = userData.totalCredits;
    }
}

function updateRankProgress(credits) {
    // Define rank thresholds
    const rankThresholds = [
        { name: 'Beginner', min: 0, max: 99 },
        { name: 'Eco Helper', min: 100, max: 249 },
        { name: 'Eco Warrior', min: 250, max: 399 },
        { name: 'Eco Champion', min: 400, max: Infinity }
    ];
    
    // Determine current rank and next rank
    let currentRank = rankThresholds[0];
    let nextRank = rankThresholds[1];
    
    for (let i = 0; i < rankThresholds.length; i++) {
        if (credits >= rankThresholds[i].min && credits <= rankThresholds[i].max) {
            currentRank = rankThresholds[i];
            nextRank = i < rankThresholds.length - 1 ? rankThresholds[i + 1] : null;
            break;
        }
    }
    
    // Update progress elements if they exist
    if (document.getElementById('currentRankName')) {
        document.getElementById('currentRankName').textContent = currentRank.name;
    }
    
    if (document.getElementById('nextRankName') && nextRank) {
        document.getElementById('nextRankName').textContent = nextRank.name;
    }
    
    if (document.getElementById('nextRankCredits') && nextRank) {
        const creditsNeeded = nextRank.min - credits;
        document.getElementById('nextRankCredits').textContent = `${creditsNeeded} credits needed`;
    } else if (document.getElementById('nextRankCredits')) {
        document.getElementById('nextRankCredits').textContent = 'Maximum rank achieved!';
    }
    
    if (document.getElementById('rankProgressBar') && nextRank) {
        const progressPercent = ((credits - currentRank.min) / (nextRank.min - currentRank.min)) * 100;
        document.getElementById('rankProgressBar').style.width = `${progressPercent}%`;
        
        if (document.getElementById('progressPercent')) {
            document.getElementById('progressPercent').textContent = `${Math.round(progressPercent)}%`;
        }
    } else if (document.getElementById('rankProgressBar')) {
        document.getElementById('rankProgressBar').style.width = '100%';
        
        if (document.getElementById('progressPercent')) {
            document.getElementById('progressPercent').textContent = '100%';
        }
    }
}

function populateRecentActivity(activities) {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-details">
                <h4>${activity.type}</h4>
                <p>+${activity.credits} credits earned</p>
            </div>
            <div class="activity-time">${activity.time}</div>
        `;
        activityList.appendChild(li);
    });
}

function populateRewardsPreview(rewards) {
    const rewardsPreview = document.getElementById('rewardsPreview');
    if (!rewardsPreview) return;
    
    rewardsPreview.innerHTML = '';
    
    rewards.forEach(reward => {
        const div = document.createElement('div');
        div.className = 'reward-preview-card';
        div.innerHTML = `
            <div class="reward-preview-icon">
                <i class="fas ${reward.icon}"></i>
            </div>
            <div class="reward-preview-name">${reward.name}</div>
            <div class="reward-preview-cost">${reward.cost} credits</div>
        `;
        div.addEventListener('click', () => showRewardModal(reward));
        rewardsPreview.appendChild(div);
    });
}

function populateAchievements(achievements) {
    const badgesContainer = document.getElementById('badgesContainer');
    if (!badgesContainer) return;
    
    badgesContainer.innerHTML = '';
    
    achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = 'badge-item';
        div.innerHTML = `
            <div class="badge-icon ${achievement.earned ? 'earned' : 'locked'}">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <div class="badge-name">${achievement.name}</div>
            <div class="badge-description">${achievement.description}</div>
        `;
        badgesContainer.appendChild(div);
    });
}

function showRewardModal(reward) {
    const modal = document.getElementById('rewardModal');
    if (!modal) return;
    
    // Set reward details in modal
    document.getElementById('rewardName').textContent = reward.name;
    document.getElementById('rewardDescription').textContent = reward.description;
    document.getElementById('rewardCost').textContent = reward.cost;
    document.getElementById('rewardIcon').className = `fas ${reward.icon}`;
    
    // Store selected reward data
    modal.dataset.rewardName = reward.name;
    modal.dataset.rewardCost = reward.cost;
    
    // Show the modal
    modal.classList.add('active');
}

function confirmRewardRedemption() {
    const modal = document.getElementById('rewardModal');
    if (!modal) return;
    
    const rewardName = modal.dataset.rewardName;
    const rewardCost = parseInt(modal.dataset.rewardCost);
    const userCredits = parseInt(document.getElementById('totalCredits').textContent);
    
    if (userCredits >= rewardCost) {
        // Update credits
        const newCredits = userCredits - rewardCost;
        document.getElementById('totalCredits').textContent = newCredits;
        
        if (document.getElementById('availableCredits')) {
            document.getElementById('availableCredits').textContent = newCredits;
        }
        
        // Close the modal
        modal.classList.remove('active');
        
        // Show success message
        alert(`You've successfully redeemed ${rewardName} for ${rewardCost} credits!`);
        
        // Update rank progress with new credit amount
        updateRankProgress(newCredits);
    } else {
        alert(`You need ${rewardCost - userCredits} more credits to redeem this reward.`);
    }
}

// Eco tip functionality
const ecoTips = [
    "Rinse your recyclables before disposing them to prevent contamination and earn more credits!",
    "Keep different types of recyclables separate to earn maximum credits.",
    "Flatten cardboard boxes to save space and make recycling more efficient.",
    "Remove caps from plastic bottles before recycling - they're often made from different types of plastic.",
    "Use reusable bags, bottles, and containers to reduce waste and earn sustainability badges.",
    "The plastic recycling symbol tells you what type of plastic it is - campus accepts types 1, 2, 4, and 5.",
    "Bring your old electronics to the e-waste station near the IT building for bonus credits.",
    "Every plastic bottle you recycle saves enough energy to power a light bulb for up to 6 hours!",
    "Paper can be recycled 5-7 times before the fibers become too short to be useful.",
    "Recycling aluminum requires 95% less energy than producing aluminum from raw materials."
];

let currentTipIndex = 0;

function showTipModal() {
    const modal = document.getElementById('tipModal');
    if (!modal) return;
    
    document.getElementById('ecoTipText').textContent = ecoTips[currentTipIndex];
    
    modal.classList.add('active');
}

function showNextTip() {
    currentTipIndex = (currentTipIndex + 1) % ecoTips.length;
    document.getElementById('ecoTipText').textContent = ecoTips[currentTipIndex];
}

function refreshActivity() {
    // Animation for refresh button
    const refreshBtn = document.getElementById('refreshActivity');
    refreshBtn.style.transform = 'rotate(360deg)';
    
    // Reset after animation completes
    setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
    }, 300);
    
    // Generate new random activity data
    const userData = generateMockUserData();
    populateRecentActivity(userData.recentActivity);
} 