import { useState } from 'react';
import { X, User, Clock, MessageSquare, Send, Lock, FileText, AlertCircle } from 'lucide-react';
import '../styles/TicketDetailsModal.css';

const TicketDetailsModal = ({ ticket, onClose, onUpdate, onReply }) => {
  const [status, setStatus] = useState(ticket.status);
  const [priority, setPriority] = useState(ticket.priority);
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const handleUpdateStatus = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(ticket.ticketId, { status, priority });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(ticket.ticketId, replyMessage, isInternal);
      setReplyMessage('');
      setIsInternal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSubjectLabel = (subject) => {
    const labels = {
      technical_issue: 'Technical Issue',
      payment_issue: 'Payment Issue',
      account_issue: 'Account Issue',
      task_issue: 'Task Issue',
      feature_request: 'Feature Request',
      bug_report: 'Bug Report',
      general_inquiry: 'General Inquiry',
      other: 'Other',
    };
    return labels[subject] || subject;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ticket-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2><MessageSquare size={24} /> Ticket Details</h2>
            <span className="ticket-id-header">{ticket.ticketId}</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <FileText size={18} />
            Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'conversation' ? 'active' : ''}`}
            onClick={() => setActiveTab('conversation')}
          >
            <MessageSquare size={18} />
            Conversation ({ticket.replies?.length || 0})
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'details' && (
            <>
              <div className="ticket-info-section">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Ticket ID:</label>
                    <span>{ticket.ticketId}</span>
                  </div>
                  <div className="info-item">
                    <label>Subject:</label>
                    <span className="subject-badge">{getSubjectLabel(ticket.subject)}</span>
                  </div>
                  <div className="info-item">
                    <label>Current Status:</label>
                    <span className={`status-badge status-${ticket.status}`}>
                      {ticket.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Priority:</label>
                    <span className={`priority-badge priority-${ticket.priority}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Created:</label>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                  {ticket.resolvedAt && (
                    <div className="info-item">
                      <label>Resolved:</label>
                      <span>{formatDate(ticket.resolvedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="ticket-content-section">
                <h3><FileText size={20} /> Title</h3>
                <p className="ticket-title-text">{ticket.title}</p>

                <h3><FileText size={20} /> Description</h3>
                <p className="description-text">{ticket.description}</p>

                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div className="attachments-section">
                    <h3>Attachments</h3>
                    <div className="attachments-list">
                      {ticket.attachments.map((url, index) => (
                        <a 
                          key={index} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="attachment-link"
                        >
                          Attachment {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="user-info-section">
                <h3><User size={20} /> User Information</h3>
                {ticket.user ? (
                  <div className="user-card">
                    <img 
                      src={ticket.user.profilePhoto || '/default-avatar.png'} 
                      alt={ticket.user.fullName}
                      className="user-avatar"
                    />
                    <div className="user-info">
                      <p className="user-name">{ticket.user.fullName}</p>
                      <p className="user-type">{ticket.userType?.toUpperCase()}</p>
                      <p className="user-contact">{ticket.user.email}</p>
                    </div>
                  </div>
                ) : (
                  <p>User information not available</p>
                )}
              </div>

              <div className="action-section">
                <h3><AlertCircle size={20} /> Update Ticket</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select 
                      id="status"
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting_for_response">Waiting for Response</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                      <option value="reopened">Reopened</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select 
                      id="priority"
                      value={priority} 
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <button 
                  className="update-btn" 
                  onClick={handleUpdateStatus}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Ticket'}
                </button>
              </div>
            </>
          )}

          {activeTab === 'conversation' && (
            <>
              <div className="conversation-section">
                {ticket.replies && ticket.replies.length > 0 ? (
                  <div className="replies-list">
                    {ticket.replies.map((reply) => (
                      <div 
                        key={reply.id} 
                        className={`reply-item ${reply.isAdminReply ? 'admin-reply' : 'user-reply'} ${reply.isInternal ? 'internal-note' : ''}`}
                      >
                        <div className="reply-header">
                          <div className="reply-author">
                            <img 
                              src={reply.user?.profilePhoto || '/default-avatar.png'} 
                              alt={reply.user?.fullName || 'User'}
                              className="reply-avatar"
                            />
                            <div>
                              <p className="author-name">{reply.user?.fullName || 'Unknown'}</p>
                              <p className="author-role">
                                {reply.isAdminReply ? 'Admin' : ticket.userType}
                                {reply.isInternal && <><Lock size={12} /> Internal Note</>}
                              </p>
                            </div>
                          </div>
                          <span className="reply-time">{formatDate(reply.createdAt)}</span>
                        </div>
                        <div className="reply-body">
                          <p>{reply.message}</p>
                          {reply.attachments && reply.attachments.length > 0 && (
                            <div className="reply-attachments">
                              {reply.attachments.map((url, index) => (
                                <a 
                                  key={index} 
                                  href={url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="attachment-link"
                                >
                                  Attachment {index + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-conversation">
                    <MessageSquare size={48} />
                    <p>No replies yet. Be the first to respond!</p>
                  </div>
                )}
              </div>

              <form className="reply-form" onSubmit={handleSendReply}>
                <h3><Send size={20} /> Send Reply</h3>
                
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={4}
                  required
                />

                <div className="reply-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                    />
                    <Lock size={16} />
                    Internal Note (Not visible to user)
                  </label>

                  <button 
                    type="submit" 
                    className="send-reply-btn"
                    disabled={isSubmitting || !replyMessage.trim()}
                  >
                    <Send size={16} />
                    {isSubmitting ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
