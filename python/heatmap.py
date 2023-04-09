import os

from flask import Flask, request, jsonify

import requests
import pickle
import numpy as np
import pandas as pd
import pickle
from tqdm import tqdm
import matplotlib
import matplotlib.pyplot as plt
# color_map = plt.cm.winter
from matplotlib.patches import RegularPolygon
import math
from PIL import Image
# Needed for custom colour mapping!
from matplotlib.colors import ListedColormap
import matplotlib.colors as mcolors

c = mcolors.ColorConverter().to_rgb
positive_cm = ListedColormap([c('#e1e5e5'),c('#3dcc00')])
negative_cm = ListedColormap([c('#e69d95'),c('#e02510')])


# Set up the API call variables
# team_name = 'Edmonton Oilers'
# full_name = 'Ryan Nugent-Hopkins'

os.chdir(os.path.dirname(__file__))

def plot_heatmap(team_name, full_name):
    api = f"https://statsapi.web.nhl.com/api/v1/schedule?season=20222023"
    dates = requests.get(api).json()['dates']
    game_data = []
    team_game_ids = []
    team = "Edmonton Oilers"
    for date in tqdm(dates):
        for game in date['games']:
            home_team = game['teams']['home']['team']['name']
            away_team = game['teams']['away']['team']['name']
            if home_team == team or away_team == team:
                team_game_ids.append(game['gamePk'])

    game_ids = {"id": team_game_ids}
    game_ids = game_ids['id']
    # Loop over the counter and format the API call
    for game_id in tqdm(game_ids):
        r = requests.get(url='https://statsapi.web.nhl.com/api/v1/game/'+str(game_id)+'/feed/live')
        data = r.json()
        game_data.append(data)

    league_data = {'Shot': {}}
    league_data['Shot']['x'] = []
    league_data['Shot']['y'] = []
    league_data['Goal'] = {}
    league_data['Goal']['x'] = []
    league_data['Goal']['y'] = []
    event_types = ['Shot','Goal']

    for data in tqdm(game_data):
        if 'liveData' not in data:
            continue
        plays = data['liveData']['plays']['allPlays']
        for play in plays:
            if play.get('team', {}).get('name', None) == team_name:
                for event in event_types:
                    if play['result']['event'] in [event]:
                        if 'x' in play['coordinates']:
                            league_data[event]['x'].append(play['coordinates']['x'])
                            league_data[event]['y'].append(play['coordinates']['y'])

    player_data = {}
    player_data['Shot'] = {}
    player_data['Shot']['x'] = []
    player_data['Shot']['y'] = []
    player_data['Goal'] = {}
    player_data['Goal']['x'] = []
    player_data['Goal']['y'] = []


    for data in tqdm(game_data):
        if 'liveData' not in data:
            continue
        plays = data['liveData']['plays']['allPlays']
        for play in plays:
            if play.get('team', {}).get('name', None) == team_name:
                for player in play.get('players', []):
                    if player['player']['fullName'] in [full_name] and player['playerType'] in ["Shooter","Scorer"]:
                        for event in event_types:
                            if play['result']['event'] in [event]:
                                if 'x' in play['coordinates']:
                                    player_data[event]['x'].append(play['coordinates']['x'])
                                    player_data[event]['y'].append(play['coordinates']['y'])


    # Get the total number of shots made by the player
    player_total_shots = len(player_data['Shot']['x']) + len(player_data['Goal']['x'])
    # Find the players goal score percentage
    player_goal_pct = len(player_data['Goal']['x'])/player_total_shots
    # Find the total number of shots taken in the league
    league_total_shots = len(league_data['Shot']['x']) + len(league_data['Goal']['x'])
    # Get the league percentage
    league_goal_pct = len(league_data['Goal']['x'])/league_total_shots
    # Calculate the spread of the SOG (Shots on Goal) %
    PL_e_spread = player_goal_pct-league_goal_pct

    # To keep the aspect ration correct we use a square figure size
    xbnds = np.array([-100.,100.0])
    ybnds = np.array([-100,100])
    extent = [xbnds[0],xbnds[1],ybnds[0],ybnds[1]]
    # We are going to bin in 30 unit increments.  It is fun to play with this!
    gridsize= 30
    mincnt=0

    # First concatenate the arrays for x and y league data
    league_x_all_shots = league_data['Shot']['x'] + league_data['Goal']['x']
    league_y_all_shots = league_data['Shot']['y'] + league_data['Goal']['y']
    # Perform the coordinate flipping!
    league_x_all_shots_normalized = []
    league_y_all_shots_normalized = []
    # Enumerate the list so we can use the index for y also
    for i, s in enumerate(league_x_all_shots):
        if league_x_all_shots[i] < 0:
            league_x_all_shots_normalized.append(-league_x_all_shots[i])
            league_y_all_shots_normalized.append(-league_y_all_shots[i])
        else:
            league_x_all_shots_normalized.append(league_x_all_shots[i])
            league_y_all_shots_normalized.append(league_y_all_shots[i])

    # Do the same treatment for the goals
    league_x_goal_normalized = []
    league_y_goal_normalized = []
    for i, s in enumerate(league_data['Goal']['x']):
        if league_data['Goal']['x'][i] < 0:
            league_x_goal_normalized.append(-league_data['Goal']['x'][i])
            league_y_goal_normalized.append(-league_data['Goal']['y'][i])
        else:
            league_x_goal_normalized.append(league_data['Goal']['x'][i])
            league_y_goal_normalized.append(league_data['Goal']['y'][i])

    league_hex_data = plt.hexbin(league_x_all_shots_normalized,
       league_y_all_shots_normalized,gridsize=gridsize,
       extent=extent,mincnt=mincnt,alpha=0.0)
    # Now we extract the bin coordinates and counts
    league_verts = league_hex_data.get_offsets()
    league_shot_frequency = league_hex_data.get_array()
    # Do the same thing for the goal data
    league_goal_hex_data =  plt.hexbin(league_x_goal_normalized,
       league_y_goal_normalized,gridsize=gridsize,
       extent=extent,mincnt=mincnt,alpha=0.0)
    # Since the grid is the same we can use a shared bin coordinate set from the above. So here we just get the counts
    league_goal_frequency = league_goal_hex_data.get_array()


    # Using matplotlib we create a new figure for plotting
    fig=plt.figure(figsize=(10,10))
    ax = fig.add_subplot(111)
    # Clean up the figure to be completely blank
    ax.set_facecolor("white")
    fig.patch.set_facecolor("white")
    fig.patch.set_alpha(0.0)
    # Remove the labelling of axes
    ax.set_xticklabels(labels = [''], fontsize = 18,
       alpha = .7,minor=False)
    ax.set_yticklabels(labels = [''], fontsize = 18,
       alpha = .7,minor=False)
    # Using pillow to get the rink image and extract the image size
    I = Image.open('Screenshot from 2023-04-08 18-55-13.png')
    ax.imshow(I)
    width, height = I.size

    # Calculate the scaling factor and offset (trial and error)
    scalingx=width/100-0.6
    scalingy=height/100+0.5
    x_trans=33
    y_trans=height/2
    # We will want to scale the size of our hex bins with the image so we calculate a "radius" scaling factor here
    S = 3.8*scalingx

    player_x_all_shots = player_data['Shot']['x'] + player_data['Goal']['x']
    player_y_all_shots = player_data['Shot']['y'] + player_data['Goal']['y']

    # Perform the coordinate flipping!
    player_x_all_shots_normalized = []
    player_y_all_shots_normalized = []
    # Enumerate the list so we can use the index for y also
    for i, s in enumerate(player_x_all_shots):
        if player_x_all_shots[i] < 0:
            player_x_all_shots_normalized.append(-player_x_all_shots[i])
            player_y_all_shots_normalized.append(-player_y_all_shots[i])
        else:
            player_x_all_shots_normalized.append(player_x_all_shots[i])
            player_y_all_shots_normalized.append(player_y_all_shots[i])

    # Do the same treatment for the goals
    player_x_goal_normalized = []
    player_y_goal_normalized = []
    for i, s in enumerate(player_data['Goal']['x']):
        if player_data['Goal']['x'][i] < 0:
            player_x_goal_normalized.append(-player_data['Goal']['x'][i])
            player_y_goal_normalized.append(-player_data['Goal']['y'][i])
        else:
            player_x_goal_normalized.append(player_data['Goal']['x'][i])
            player_y_goal_normalized.append(player_data['Goal']['y'][i])

    player_hex_data = plt.hexbin(player_x_all_shots_normalized,
       player_y_all_shots_normalized,gridsize=gridsize,
       extent=extent,mincnt=mincnt,alpha=0.0)
    # Now we extract the bin coordinates and counts
    player_verts = player_hex_data.get_offsets()
    player_shot_frequency = player_hex_data.get_array()
    # Do the same thing for the goal data
    player_goal_hex_data =  plt.hexbin(player_x_goal_normalized,
       player_y_goal_normalized,gridsize=gridsize,
       extent=extent,mincnt=mincnt,alpha=0.0)
    # Since the grid is the same we can use a shared bin coordinate set from the above. So here we just get the counts
    player_goal_frequency = player_goal_hex_data.get_array()

    league_efficiency = []
    player_efficiency = []
    relative_efficiency = []
    for i in range(0,len(league_shot_frequency)):
        if league_shot_frequency[i] < 2 or player_shot_frequency[i] < 2:
            continue
        league_efficiency.append(league_goal_frequency[i] / league_shot_frequency[i])
        player_efficiency.append(player_goal_frequency[i] / player_shot_frequency[i])
        relative_efficiency.append(
            (player_goal_frequency[i] / player_shot_frequency[i] -
             (league_goal_frequency[i] / league_shot_frequency[i])))

    for i,v in enumerate(player_verts):
        if player_shot_frequency[i] < 1: continue
        scaled_player_shot_frequency = player_shot_frequency[i] / max(player_shot_frequency)
        radius = S * math.sqrt(scaled_player_shot_frequency)
        player_efficiency = player_goal_frequency[i] / player_shot_frequency[i]
        league_efficiency = league_goal_frequency[i] / league_shot_frequency[i]
        relative_efficiency = player_efficiency - league_efficiency
        if relative_efficiency > 0:
            colour = positive_cm(math.pow(relative_efficiency, 0.1))
        else:
            colour = negative_cm(math.pow(-relative_efficiency, 0.1))
        hex = RegularPolygon((x_trans + v[0] * scalingx,
                              y_trans - v[1] * scalingy), numVertices=6, radius=radius,
                             orientation=np.radians(0), facecolor=colour, alpha=1,
                             edgecolor=None)
        ax.add_patch(hex)

    # plt.show()
    plt.savefig(f'figures/{team_name}_{full_name}.png')
    return f'{os.getcwd()}/{team_name}_{full_name}.png'


app = Flask(__name__)


@app.route('/api/make-heatmap', methods=['GET'])
def handle_get_request():
    # get the data from the request
    team_name = request.args.get('teamName')
    player_name = request.args.get('playerName')
    # do some processing with the data
    file = plot_heatmap(team_name,player_name)
    processed_data = {'file': file}

    # return a JSON response
    return jsonify(processed_data)


if __name__ == '__main__':
    app.run(debug=True)
