import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv('RAWG_API_KEY')


class RawgClient:
    """Client for the RAWG Video Games Database API."""
    def __init__(self, api_key: str):
        self.base_url = 'https://api.rawg.io/api'
        self.api_key = api_key

    def format_game_data(self, game: dict, screenshots: list):
        """Format game data for better readability."""
        formatted_game = {
                'name': game.get('name'),
                'id': game.get('id'),
                'released': game.get('released'),
                'description': game.get('description'),
                'background_image': game.get('background_image'),
                'playtime': game.get('playtime'),
                'platforms': game.get('platforms'),
                'stores': game.get('stores'),
                'genres': game.get('genres'),
                'publishers': game.get('publishers'),
                'metacritic': game.get('metacritic'),
                'esrb_rating': game.get('esrb_rating'),
                'screenshots': screenshots
            }
        return formatted_game

    def get_game_details(self, game_id: int):
        """Fetch detailed information about a specific game."""
        params = {
            'key': self.api_key
        }
        
        try:
            response = requests.get(f'{self.base_url}/games/{game_id}', params=params)
            response.raise_for_status() 
            data = response.json()
            return data
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            return {}

    def get_games_by_platform(self, platforms: list, page_size: int = 5):
        """Fetch games from the RAWG API based on platforms."""
        params = {
            'key': self.api_key,
            'platforms': ','.join(map(str, platforms)),
            'page_size': page_size
        }
        
        try:
            response = requests.get(f'{self.base_url}/games', params=params)
            response.raise_for_status() 
            data = response.json()
            data['results']
            
            # Details for each game
            games = []
            for game in data['results']:
                game_id = game.get('id')
                game_screenshots = [item['image'] for item in game.get('short_screenshots', [])]
                if game_details := self.get_game_details(game_id):
                    game_details = self.format_game_data(game_details, game_screenshots)
                    games.append(game_details)
                    
            return games
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            return []
        
    def get_platforms_ids(self):
        """Fetch all platform IDs from the RAWG API."""
        params = {
            'key': self.api_key
        }
        
        try:
            response = requests.get(f'{self.base_url}/platforms', params=params)
            response.raise_for_status() 
            data = response.json()
            return {platform['name']: platform['id'] for platform in data['results']}
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            return {}


def save_to_json(data, filename='games.json'):
    with open(filename, encoding= 'UTF-8', mode='w') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
        
if __name__ == "__main__":
    api = RawgClient(API_KEY)
    
    platforms = api.get_platforms_ids()
    platforms_ids = [platform_id for _, platform_id in platforms.items()]
    
    if games := api.get_games_by_platform(platforms_ids, page_size=80):
        # Criar a pasta data
        if not os.path.exists('data'):
            os.makedirs('data')
        save_to_json(games, filename='data/games.json')
        print(f"Saved {len(games)} games to data/games.json")
    else:
        print("No games found or an error occurred.")
    