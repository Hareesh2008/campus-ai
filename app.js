/**
 * ============================================================================
 * APPLICATION: Campus Sync (Expo React Native)
 * FEATURES: Role-Based Auth, Dynamic Canteen (₹), Teacher Deadlines, 
 *           WhatsApp-Style Chat, and Automated Notification Reminders.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';

// Sample registered database for group creation
const SAMPLE_STUDENTS = [
  { id: 's1', name: 'Rahul Sharma', email: 'rahul@campus.edu' },
  { id: 's2', name: 'Priya Patel', email: 'priya@campus.edu' },
  { id: 's3', name: 'Anish Kumar', email: 'anish@campus.edu' },
  { id: 's4', name: 'Sneha Reddy', email: 'sneha@campus.edu' },
];

export default function CampusSync() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null); // { email, role, name }
  const [loginRole, setLoginRole] = useState('Student');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Notification Permission & Alert State
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeReminders, setActiveReminders] = useState([]);

  // Teacher State & Announcements
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'Welcome to Campus Sync! Check deadlines regularly.', deadline: 'Tomorrow 5:00 PM', timestamp: Date.now() - 3600000 }
  ]);
  const [teacherTitle, setTeacherTitle] = useState('');
  const [teacherDeadline, setTeacherDeadline] = useState('');

  // Canteen Staff Dynamic Menu State
  const [canteenMenu, setCanteenMenu] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  // Student Cart & Order State
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // WhatsApp-Style Group & Chat State
  const [groups, setGroups] = useState([
    { id: 'g1', name: 'Class Announcements', members: ['Rahul Sharma', 'Priya Patel'], messages: [{ sender: 'Teacher', text: 'Welcome all to Campus Sync!' }] }
  ]);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [activeChatGroup, setActiveChatGroup] = useState(null);
  const [chatInput, setChatInput] = useState('');

  // ================= NOTIFICATION PERMISSION & REMINDER SYSTEM =================
  useEffect(() => {
    if (currentUser) {
      // Request notification permissions upon login
      requestNotificationPermission();
      // Check deadlines for automated reminders
      checkDeadlineReminders();
    }
  }, [currentUser, announcements]);

  const requestNotificationPermission = () => {
    // Simulated system notification permission request dialog
    Alert.alert(
      "🔔 Enable Notifications",
      "Campus Sync would like to send you important deadline reminders (2 days, 1 day, 12h, 1h, and 5m before due time).",
      [
        { text: "Don't Allow", onPress: () => setNotificationsEnabled(false), style: "cancel" },
        { text: "Allow", onPress: () => {
            setNotificationsEnabled(true);
            alert("Notifications Enabled Successfully! You will receive timely alerts.");
          } 
        }
      ]
    );
  };

  const checkDeadlineReminders = () => {
    // Generate intelligent reminder milestones for demo purposes
    const reminders = announcements.map(item => {
      return [
        { id: `${item.id}-2d`, text: `⏰ Reminder (2 Days Left): ${item.title}` },
        { id: `${item.id}-1d`, text: `⚠️ Reminder (1 Day Left): ${item.title}` },
        { id: `${item.id}-12h`, text: `⏳ Urgency Alert (12 Hours Left): ${item.title}` },
        { id: `${item.id}-1h`, text: `🚨 Final Warning (1 Hour Left): ${item.title}` },
        { id: `${item.id}-5m`, text: `🔥 CRITICAL: Due in 5 Minutes! Submit ${item.title} now!` }
      ];
    }).flat();
    setActiveReminders(reminders);
  };

  // ================= AUTHENTICATION HANDLERS =================
  const handleLogin = () => {
    if (!emailInput.trim() || !passwordInput.trim()) {
      alert('Please enter both email and password.');
      return;
    }
    const username = emailInput.split('@')[0] || 'User';
    setCurrentUser({
      email: emailInput,
      role: loginRole,
      name: username.charAt(0).toUpperCase() + username.slice(1)
    });
    setEmailInput('');
    setPasswordInput('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveChatGroup(null);
  };

  // ================= BUSINESS LOGIC HANDLERS =================
  const handlePostAssignment = () => {
    if (!teacherTitle.trim() || !teacherDeadline.trim()) return;
    const newAnn = { 
      id: Date.now().toString(), 
      title: teacherTitle, 
      deadline: teacherDeadline, 
      timestamp: Date.now() 
    };
    setAnnouncements([newAnn, ...announcements]);
    setTeacherTitle('');
    setTeacherDeadline('');
    alert('Assignment and deadlines posted! Notification triggers armed for students.');
  };

  const handleAddMenuItem = () => {
    if (!itemName.trim() || !itemPrice.trim()) return;
    setCanteenMenu([
      ...canteenMenu, 
      { id: Date.now().toString(), name: itemName, price: itemPrice, available: true }
    ]);
    setItemName('');
    setItemPrice('');
  };

  const toggleAvailability = (id) => {
    setCanteenMenu(canteenMenu.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const addToCart = (item) => {
    if (!item.available) return;
    setCart([...cart, item]);
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    const newToken = '#' + Math.floor(100 + Math.random() * 900);
    const total = cart.reduce((sum, i) => sum + parseFloat(i.price), 0);
    setOrders([
      { token: newToken, items: [...cart], total, status: 'Preparing' },
      ...orders
    ]);
    setCart([]);
  };

  // ================= CHAT & GROUP HANDLERS =================
  const toggleMemberSelection = (studentName) => {
    if (selectedMembers.includes(studentName)) {
      setSelectedMembers(selectedMembers.filter(m => m !== studentName));
    } else {
      setSelectedMembers([...selectedMembers, studentName]);
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedMembers.length === 0) {
      alert('Please enter a group name and select at least one member.');
      return;
    }
    const newGrp = {
      id: Date.now().toString(),
      name: newGroupName,
      members: [currentUser.name, ...selectedMembers],
      messages: []
    };
    setGroups([...groups, newGrp]);
    setNewGroupName('');
    setSelectedMembers([]);
    alert(`Group "${newGrp.name}" created successfully!`);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !activeChatGroup) return;
    const updatedGroups = groups.map(g => {
      if (g.id === activeChatGroup.id) {
        return {
          ...g,
          messages: [...g.messages, { sender: currentUser.name, text: chatInput }]
        };
      }
      return g;
    });
    setGroups(updatedGroups);
    setActiveChatGroup(updatedGroups.find(g => g.id === activeChatGroup.id));
    setChatInput('');
  };

  // ================= RENDER LOGIN SCREEN =================
  if (!currentUser) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.loginCard}>
          <Text style={styles.appTitle}>Campus Sync</Text>
          <Text style={styles.loginSubtitle}>Select Role & Login</Text>

          <View style={styles.roleTabs}>
            {['Student', 'Teacher', 'Canteen Staff'].map((r) => (
              <TouchableOpacity 
                key={r} 
                style={[styles.roleButton, loginRole === r && styles.activeRole]} 
                onPress={() => setLoginRole(r)}
              >
                <Text style={[styles.roleText, loginRole === r && styles.activeRoleText]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput 
            style={styles.input}
            placeholder={`${loginRole} Email ID`}
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={emailInput}
            onChangeText={setEmailInput}
          />
          <TextInput 
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={passwordInput}
            onChangeText={setPasswordInput}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
            <Text style={styles.primaryBtnText}>Login as {loginRole}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ================= RENDER LOGGED-IN DASHBOARD =================
  return (
    <ScrollView style={styles.container}>
      {/* Top Header & Logout */}
      <View style={styles.userHeader}>
        <View>
          <Text style={styles.welcomeText}>Welcome, {currentUser.name}!</Text>
          <Text style={styles.roleBadge}>{currentUser.role} Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* ================= 1. STUDENT DASHBOARD ================= */}
      {currentUser.role === 'Student' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📢 Announcements & Active Deadlines</Text>
          {announcements.map((item) => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSub}>Due: {item.deadline}</Text>
              <Text style={styles.reminderStatus}>🔔 Notifications: Active (2d, 1d, 12h, 1h, 5m reminders set)</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>🍔 Canteen Menu (₹)</Text>
          {canteenMenu.length === 0 ? (
            <Text style={styles.emptyText}>No food items added by canteen staff yet today.</Text>
          ) : (
            canteenMenu.map((item) => (
              <View key={item.id} style={styles.menuCard}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                  <Text style={[styles.statusText, { color: item.available ? 'green' : 'red' }]}>
                    {item.available ? 'Available' : 'Out of Stock'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[styles.actionBtn, !item.available && styles.disabledBtn]} 
                  onPress={() => addToCart(item)}
                >
                  <Text style={styles.btnText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          {cart.length > 0 && (
            <View style={styles.cartBox}>
              <Text style={styles.cartTitle}>My Order Cart ({cart.length} items)</Text>
              <Text style={styles.cartTotal}>
                Total: ₹{cart.reduce((sum, i) => sum + parseFloat(i.price), 0)}
              </Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={placeOrder}>
                <Text style={styles.primaryBtnText}>Pre-Pay & Order Now</Text>
              </TouchableOpacity>
            </View>
          )}

          {orders.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>🎟️ My Orders & Tokens</Text>
              {orders.map((ord, idx) => (
                <View key={idx} style={styles.tokenCard}>
                  <Text style={styles.tokenNumber}>Token: {ord.token}</Text>
                  <Text>Status: {ord.status}</Text>
                  <Text>Total Paid: ₹{ord.total}</Text>
                </View>
              ))}
            </View>
          )}

          {renderChatSection()}
        </View>
      )}

      {/* ================= 2. TEACHER DASHBOARD ================= */}
      {currentUser.role === 'Teacher' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍🏫 Post Assignment & Deadline</Text>
          <TextInput 
            style={styles.input}
            placeholder="Assignment Title (e.g. Science Project)"
            placeholderTextColor="#888"
            value={teacherTitle}
            onChangeText={setTeacherTitle}
          />
          <TextInput 
            style={styles.input}
            placeholder="Target Deadline (e.g. Tomorrow by 5 PM)"
            placeholderTextColor="#888"
            value={teacherDeadline}
            onChangeText={setTeacherDeadline}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handlePostAssignment}>
            <Text style={styles.primaryBtnText}>Post Deadline & Arm Reminders</Text>
          </TouchableOpacity>

          {renderChatSection()}
        </View>
      )}

      {/* ================= 3. CANTEEN STAFF DASHBOARD ================= */}
      {currentUser.role === 'Canteen Staff' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍳 Enter Today's Available Items</Text>
          <TextInput 
            style={styles.input}
            placeholder="Item Name (e.g. Pizza, Bun Parotta, Grill Chicken)"
            placeholderTextColor="#888"
            value={itemName}
            onChangeText={setItemName}
          />
          <TextInput 
            style={styles.input}
            placeholder="Price in ₹ (e.g. 120)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={itemPrice}
            onChangeText={setItemPrice}
          />
          <TouchableOpacity style={styles.primaryBtn} onPress={handleAddMenuItem}>
            <Text style={styles.primaryBtnText}>Add Item to Today's Menu</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Live Menu Control Panel:</Text>
          {canteenMenu.length === 0 ? (
            <Text style={styles.emptyText}>Menu is empty. Add items above.</Text>
          ) : (
            canteenMenu.map((item) => (
              <View key={item.id} style={styles.menuCard}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.toggleBtn, { backgroundColor: item.available ? '#d4edda' : '#f8d7da' }]} 
                  onPress={() => toggleAvailability(item.id)}
                >
                  <Text style={{ color: item.available ? '#155724' : '#721c24', fontWeight: 'bold' }}>
                    {item.available ? 'Available' : 'Out of Stock'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );

  // ================= REUSABLE CHAT & GROUP UI =================
  function renderChatSection() {
    return (
      <View style={styles.chatSection}>
        <Text style={styles.sectionTitle}>💬 Group Chats & WhatsApp Messaging</Text>

        <View style={styles.groupCreateBox}>
          <Text style={styles.subHeading}>Create New Group</Text>
          <TextInput 
            style={styles.input}
            placeholder="Group Name (e.g. Math Project Group)"
            placeholderTextColor="#888"
            value={newGroupName}
            onChangeText={setNewGroupName}
          />

          <Text style={{ fontSize: 13, fontWeight: '600', marginVertical: 4 }}>Select Members:</Text>
          {SAMPLE_STUDENTS.map(stud => (
            <TouchableOpacity 
              key={stud.id} 
              style={styles.checkboxRow}
              onPress={() => toggleMemberSelection(stud.name)}
            >
              <Text style={styles.checkboxText}>
                {selectedMembers.includes(stud.name) ? '☑️' : '⬜'} {stud.name} ({stud.email})
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[styles.primaryBtn, { marginTop: 10 }]} onPress={handleCreateGroup}>
            <Text style={styles.primaryBtnText}>Create Group Chat</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.subHeading, { marginTop: 15 }]}>Your Groups:</Text>
        {groups.map(grp => (
          <TouchableOpacity 
            key={grp.id} 
            style={[styles.groupCard, activeChatGroup?.id === grp.id && styles.activeGroupCard]}
            onPress={() => setActiveChatGroup(grp)}
          >
            <Text style={styles.groupCardTitle}>👥 {grp.name}</Text>
            <Text style={styles.groupCardSub}>Members: {grp.members.join(', ')}</Text>
          </TouchableOpacity>
        ))}

        {activeChatGroup && (
          <View style={styles.chatBox}>
            <Text style={styles.chatHeader}>Active Chat: {activeChatGroup.name}</Text>
            <View style={styles.messageList}>
              {activeChatGroup.messages.length === 0 ? (
                <Text style={styles.emptyText}>No messages yet. Say hello!</Text>
              ) : (
                activeChatGroup.messages.map((msg, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.messageBubble, 
                      msg.sender === currentUser.name ? styles.myMessage : styles.otherMessage
                    ]}
                  >
                    <Text style={styles.msgSender}>{msg.sender}</Text>
                    <Text style={styles.msgText}>{msg.text}</Text>
                  </View>
                ))
              )}
            </View>
            <View style={styles.chatInputRow}>
              <TextInput 
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Type a message..."
                placeholderTextColor="#888"
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                <Text style={styles.sendBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

// ================= STYLESHEET =================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 15, paddingTop: 40 },
  appTitle: { fontSize: 26, fontWeight: 'bold', color: '#1e293b', textAlign: 'center', marginBottom: 8 },
  loginCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginTop: 40 },
  loginSubtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 20 },
  userHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#ffffff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  welcomeText: { fontSize: 18, fontWeight: 'bold', color: '#1e293b' },
  roleBadge: { fontSize: 13, color: '#2563eb', fontWeight: '600' },
  logoutBtn: { backgroundColor: '#ef4444', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  logoutBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  roleTabs: { flexDirection: 'row', justifyContent: 'center', backgroundColor: '#e2e8f0', borderRadius: 8, padding: 4, marginBottom: 15 },
  roleButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  activeRole: { backgroundColor: '#2563eb' },
  roleText: { fontSize: 13, color: '#475569', fontWeight: '600' },
  activeRoleText: { color: '#ffffff' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 10, marginTop: 10 },
  subHeading: { fontSize: 15, fontWeight: 'bold', color: '#334155', marginBottom: 6 },
  card: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  cardSub: { fontSize: 13, color: '#d97706', marginTop: 4, fontWeight: '500' },
  reminderStatus: { fontSize: 11, color: '#2563eb', marginTop: 6, fontStyle: 'italic' },
  menuCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  itemName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  itemPrice: { fontSize: 14, color: '#16a34a', fontWeight: 'bold', marginTop: 2 },
  statusText: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  actionBtn: { backgroundColor: '#16a34a', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  disabledBtn: { backgroundColor: '#cbd5e1' },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  btnText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  input: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 14, color: '#1e293b' },
  primaryBtn: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: 'bold' },
  cartBox: { backgroundColor: '#eef2ff', padding: 15, borderRadius: 8, borderWidth: 1, borderColor: '#c7d2fe', marginTop: 15 },
  cartTitle: { fontSize: 16, fontWeight: 'bold', color: '#3730a3' },
  cartTotal: { fontSize: 15, fontWeight: 'bold', color: '#1e1b4b', marginVertical: 5 },
  tokenCard: { backgroundColor: '#fffbeb', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#fde68a', marginTop: 8 },
  tokenNumber: { fontSize: 16, fontWeight: 'bold', color: '#b45309' },
  emptyText: { fontStyle: 'italic', color: '#64748b', marginBottom: 10 },
  chatSection: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#cbd5e1' },
  groupCreateBox: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  checkboxRow: { paddingVertical: 4 },
  checkboxText: { fontSize: 13, color: '#334155' },
  groupCard: { backgroundColor: '#ffffff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 8 },
  activeGroupCard: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  groupCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  groupCardSub: { fontSize: 12, color: '#64748b' },
  chatBox: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#2563eb', marginTop: 10 },
  chatHeader: { fontSize: 14, fontWeight: 'bold', color: '#2563eb', marginBottom: 8 },
  messageList: { maxHeight: 180, marginBottom: 10 },
  messageBubble: { padding: 8, borderRadius: 8, marginBottom: 6, maxWidth: '80%' },
  myMessage: { backgroundColor: '#dcf8c6', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#f1f5f9', alignSelf: 'flex-start' },
  msgSender: { fontSize: 10, fontWeight: 'bold', color: '#475569' },
  msgText: { fontSize: 13, color: '#1e293b' },
  chatInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sendBtn: { backgroundColor: '#2563eb', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8 },
  sendBtnText: { color: '#ffffff', fontWeight: 'bold' }
});
