import React, { useState, useEffect } from 'react';
import { Clock, Play, Trash2, Save } from 'lucide-react';
import { userProfileService, SavedSession } from '../services/userProfileService';

interface SavedSessionsProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (session: SavedSession) => void;
}

export function SavedSessions({ isOpen, onClose, onLoadSession }: SavedSessionsProps) {
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSessions(userProfileService.getSavedSessions());
    }
  }, [isOpen]);

  const handleLoadSession = (session: SavedSession) => {
    onLoadSession(session);
    onClose();
  };

  const handleDeleteSession = (sessionId: string) => {
    // Note: This would need to be implemented in userProfileService
    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Save className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Saved Sessions</h2>
                <p className="text-green-100">Resume your previous work</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <Save className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Saved Sessions</h3>
              <p className="text-gray-500">Your saved sessions will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {new Date(session.timestamp).toLocaleDateString()} at{' '}
                        {new Date(session.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleLoadSession(session)}
                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Step:</strong> {session.currentStep} of 5
                  </div>
                  
                  {session.inputs.interests?.length > 0 && (
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Interests:</strong> {session.inputs.interests.slice(0, 3).join(', ')}
                      {session.inputs.interests.length > 3 && ` +${session.inputs.interests.length - 3} more`}
                    </div>
                  )}
                  
                  {session.generatedIdeas?.length > 0 && (
                    <div className="text-sm text-green-600">
                      <strong>Generated Ideas:</strong> {session.generatedIdeas.length} business ideas
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}