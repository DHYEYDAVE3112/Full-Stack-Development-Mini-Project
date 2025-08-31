@@ .. @@
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
+import { AuthProvider } from './context/AuthContext';
+import ProtectedRoute from './components/ProtectedRoute';
+import LandingPage from './pages/LandingPage';
+import AuthPage from './pages/AuthPage';
 import Dashboard from './pages/Dashboard';
 import RenteaseDashboard from './pages/RenteaseDashboard';
 import PropertiesPage from './pages/PropertiesPage';
 import TenantsPage from './pages/TenantsPage';
 import RentPaymentsPage from './pages/RentPaymentsPage';
 import MaintenancePage from './pages/MaintenancePage';
 import LeasePage from './pages/LeasePage';
-import './styles/RenteaseDashboard.css';
 
 function App() {
   return (
-    <Router>
-      <RenteaseDashboard>
-        <Routes>
-          <Route path="/" element={<Dashboard />} />
-          <Route path="/properties" element={<PropertiesPage />} />
-          <Route path="/tenants" element={<TenantsPage />} />
-          <Route path="/rent-payments" element={<RentPaymentsPage />} />
-          <Route path="/maintenance" element={<MaintenancePage />} />
-          <Route path="/lease" element={<LeasePage />} />
-        </Routes>
-      </RenteaseDashboard>
-    </Router>
+    <AuthProvider>
+      <Router>
+        <Routes>
+          <Route path="/" element={<LandingPage />} />
+          <Route path="/auth" element={<AuthPage />} />
+          <Route path="/dashboard" element={
+            <ProtectedRoute>
+              <RenteaseDashboard>
+                <Dashboard />
+              </RenteaseDashboard>
+            </ProtectedRoute>
+          } />
+          <Route path="/properties" element={
+            <ProtectedRoute>
+              <RenteaseDashboard>
+                <PropertiesPage />
+              </RenteaseDashboard>
+            </ProtectedRoute>
+          } />
+          <Route path="/tenants" element={
+            <ProtectedRoute>
+              <RenteaseDashboard>
+                <TenantsPage />
+              </RenteaseDashboard>
+            </ProtectedRoute>
+          } />
+          <Route path="/rent-payments" element={
+            <ProtectedRoute>
+              <RenteaseDashboard>
+                <RentPaymentsPage />
+              </RenteaseDashboard>
+            </ProtectedRoute>
+          } />
+          <Route path="/maintenance" element={
+            <ProtectedRoute>
+              <RenteaseDashboard>
+                <MaintenancePage />
+              </RenteaseDashboard>
+            </ProtectedRoute>
+          } />
+          <Route path="/lease" element={
+            <ProtectedRoute>
+              <RenteaseDashboard>
+                <LeasePage />
+              </RenteaseDashboard>
+            </ProtectedRoute>
+          } />
+        </Routes>
+      </Router>
+    </AuthProvider>
   );
 }
 
 export default App;