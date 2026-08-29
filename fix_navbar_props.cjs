const fs = require('fs');
const file = 'src/components/Navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

const propMatch = /interface Props \{[\s\S]*?\}/;
const newProps = `interface Props {
  currentTab: 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces';
  onSelectTab: (tab: 'cases' | 'graph' | 'discussions' | 'supporters' | 'evidence' | 'workspaces') => void;
  onOpenSubmitModal: () => void;
  onOpenProfileModal: () => void;
  onOpenDirectMessages: () => void;
  onOpenAdminConsole: () => void;
  onOpenSupportersModal: () => void;
  onRandomRabbitHole: () => void;
  currentUser: UserProfile | null;
  legacyProfile: UserProfile;
  isMuted: boolean;
  onToggleMute: () => void;
  onLogin: () => void;
  onLogout: () => void;
  unreadNotificationCount?: number;
  onOpenNotifications?: () => void;
}`;
content = content.replace(propMatch, newProps);

const fcMatch = /export const Navbar: React.FC<Props> = \(\{([\s\S]*?)\}\) => \{/;
const newFc = `export const Navbar: React.FC<Props> = ({
  currentTab, onSelectTab, onOpenSubmitModal, onOpenProfileModal, onOpenDirectMessages, onOpenAdminConsole, onOpenSupportersModal, onRandomRabbitHole, currentUser, legacyProfile, isMuted, onToggleMute, onLogin, onLogout, unreadNotificationCount = 0, onOpenNotifications
}) => {`;
content = content.replace(fcMatch, newFc);

fs.writeFileSync(file, content);
