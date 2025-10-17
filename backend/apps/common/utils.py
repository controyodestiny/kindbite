"""
Common utilities for KindBite application.
"""
import uuid
import os
from django.utils.text import slugify


def generate_unique_filename(instance, filename):
    """
    Generate unique filename for uploaded files.
    """
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4().hex}.{ext}"
    return filename


def get_upload_path(instance, filename):
    """
    Generate upload path for user files.
    """
    filename = generate_unique_filename(instance, filename)
    return os.path.join('uploads', instance.__class__.__name__.lower(), filename)


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two coordinates using Haversine formula.
    Returns distance in kilometers.
    """
    import math
    
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
    
    return c * r


def generate_slug(text, max_length=50):
    """
    Generate URL-safe slug from text.
    """
    return slugify(text)[:max_length]


class KindCoinsCalculator:
    """
    Utility class for calculating KindCoins rewards.
    """
    
    # Base rewards for different actions
    REWARDS = {
        'food_rescued': 10,
        'food_provided': 15,
        'food_verified': 5,
        'referral': 25,
        'profile_complete': 20,
        'first_rescue': 50,
    }
    
    @classmethod
    def calculate_rescue_reward(cls, original_price, environmental_impact=0):
        """
        Calculate reward for rescuing food.
        """
        base_reward = cls.REWARDS['food_rescued']
        
        # Bonus based on price saved
        price_bonus = min(original_price // 1000, 10)  # Max 10 bonus
        
        # Environmental impact bonus
        env_bonus = int(environmental_impact * 2)  # 2 coins per kg CO2 saved
        
        return base_reward + price_bonus + env_bonus
    
    @classmethod
    def calculate_provider_reward(cls, items_provided, avg_rating=0):
        """
        Calculate reward for providing food.
        """
        base_reward = cls.REWARDS['food_provided'] * items_provided
        
        # Quality bonus based on rating
        if avg_rating >= 4.5:
            quality_bonus = items_provided * 5
        elif avg_rating >= 4.0:
            quality_bonus = items_provided * 3
        else:
            quality_bonus = 0
        
        return base_reward + quality_bonus





















