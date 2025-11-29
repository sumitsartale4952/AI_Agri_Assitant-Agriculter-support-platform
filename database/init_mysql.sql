-- Create AI Agri Assistant Database
CREATE DATABASE IF NOT EXISTS ai_agri_assistant;
USE ai_agri_assistant;

-- ============================================================================
-- Irrigation Schedules Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS irrigation_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    crop VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    season VARCHAR(50),
    
    -- Water requirements
    total_water_needed VARCHAR(50),
    frequency VARCHAR(100),
    best_time VARCHAR(100),
    tips TEXT,
    
    -- Weather-based adjustments
    temperature_based_adjustment FLOAT,
    humidity_based_adjustment FLOAT,
    rainfall_based_adjustment FLOAT,
    
    -- Current weather
    current_temperature FLOAT,
    current_humidity FLOAT,
    current_rainfall FLOAT,
    weather_description VARCHAR(100),
    
    -- Recommendations
    recommended_frequency VARCHAR(100),
    recommended_water_amount VARCHAR(100),
    recommended_timing VARCHAR(100),
    next_irrigation_date DATETIME,
    
    -- Active alerts
    active_alerts JSON,
    
    -- Metadata
    is_saved BOOLEAN DEFAULT TRUE,
    user_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_crop (crop),
    INDEX idx_city (city),
    INDEX idx_user_id (user_id),
    INDEX idx_is_saved (is_saved),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Alert Preferences Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS alert_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    
    -- Alert type toggles
    heavy_rain_alert BOOLEAN DEFAULT TRUE,
    high_temperature_alert BOOLEAN DEFAULT TRUE,
    frost_warning_alert BOOLEAN DEFAULT TRUE,
    wind_alert BOOLEAN DEFAULT TRUE,
    humidity_alert BOOLEAN DEFAULT TRUE,
    
    -- Alert thresholds
    rainfall_threshold FLOAT DEFAULT 5.0,
    temperature_high_threshold FLOAT DEFAULT 32.0,
    temperature_low_threshold FLOAT DEFAULT 0.0,
    wind_speed_threshold FLOAT DEFAULT 25.0,
    humidity_threshold FLOAT DEFAULT 85.0,
    
    -- Notification preferences
    enable_sms_notifications BOOLEAN DEFAULT FALSE,
    enable_email_notifications BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(20),
    email VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Saved Crops Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_crops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100),
    crop_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    area_in_hectares FLOAT,
    planting_date DATETIME,
    expected_harvest_date DATETIME,
    notes TEXT,
    
    -- Link to last schedule
    last_schedule_id INT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_crop_name (crop_name),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Insert Sample Schedules
-- ============================================================================

INSERT INTO irrigation_schedules (
    crop, city, season, total_water_needed, frequency, best_time, tips,
    current_temperature, current_humidity, current_rainfall, weather_description,
    recommended_frequency, recommended_water_amount, recommended_timing,
    active_alerts, user_id, is_saved
) VALUES 
(
    'rice', 'Mumbai', 'Kharif', '80-100 cm', 'Every 5-7 days', 'Early morning or evening', 
    'Maintain 5-10 cm standing water', 29.99, 32, 0, 'smoke',
    'Every 5-7 days', '0% adjustment', 'Early morning or evening',
    '[]', 'default_user', TRUE
),
(
    'wheat', 'Delhi', 'Rabi', '40-60 cm', 'Every 21-28 days', 'Early morning', 
    'First irrigation 21 days after sowing', 15, 45, 0, 'clear',
    'Every 21-28 days', '0% adjustment', 'Early morning',
    '[]', 'default_user', TRUE
),
(
    'cotton', 'Gujarat', 'Kharif', '60-80 cm', 'Every 10-15 days', 'Early morning', 
    'Reduce frequency during monsoon', 35, 55, 0, 'sunny',
    'Every 9 days (adjusted)', '+20% adjustment', 'Early morning',
    '[{"type":"HIGH_TEMPERATURE","title":"High Temperature Expected","action":"Increase irrigation by 20%"}]', 'default_user', TRUE
);

-- ============================================================================
-- Display Results
-- ============================================================================

SELECT 'Database initialized successfully!' as message;
SELECT COUNT(*) as total_schedules FROM irrigation_schedules;
SELECT COUNT(*) as total_preferences FROM alert_preferences;
SELECT COUNT(*) as total_crops FROM saved_crops;
