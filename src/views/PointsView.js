import React from 'react';

const PointsView = ({ userPoints }) => (
  <div>
    <div className="p-4 lg:p-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white mb-6 lg:p-8 lg:mb-8">
        <div className="text-center">
          <h2 className="font-medium text-lg lg:text-xl">Your Balance</h2>
          <div className="font-bold mt-2 text-4xl lg:text-5xl">{userPoints}</div>
          <div className="opacity-90 text-sm lg:text-base">KindCoins</div>
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-800 mb-3 lg:text-lg lg:mb-4">
        Community Leaderboard
      </h3>
      <div className="bg-white rounded-lg shadow-md">
        {[
          { name: "Roshni L.", points: 1240, rank: 1 },
          { name: "Rania L.", points: 980, rank: 2 },
          { name: "You", points: userPoints, rank: 3 },
          { name: "Robert L.", points: 210, rank: 4 }
        ].map((user, index) => (
          <div key={index} className={`p-4 flex justify-between items-center ${
            user.name === 'You' ? 'bg-green-50' : ''
          } ${index < 3 ? 'border-b border-gray-200' : ''}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                user.rank === 1 ? 'bg-yellow-500 text-white' : 
                user.rank === 2 ? 'bg-gray-400 text-white' : 
                user.rank === 3 ? 'bg-orange-500 text-white' : 
                'bg-gray-200 text-gray-600'
              } lg:w-10 lg:h-10 lg:text-base`}>
                {user.rank}
              </div>
              <span className={`font-medium ${
                user.name === 'You' ? 'text-green-600' : 'text-gray-800'
              } lg:text-lg`}>
                {user.name}
              </span>
            </div>
            <span className="font-bold text-gray-800 lg:text-lg">
              {user.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default PointsView;
