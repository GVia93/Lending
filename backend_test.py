import requests
import json
import sys
from datetime import datetime
import uuid

class ConstructionAPITester:
    def __init__(self, base_url="http://localhost:8001/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.errors = []

    def run_test(self, name, method, endpoint, expected_status, data=None, expected_keys=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            response_data = {}
            
            try:
                response_data = response.json()
            except:
                pass

            if success:
                # Check for expected keys if provided
                if expected_keys and isinstance(response_data, dict):
                    for key in expected_keys:
                        if key not in response_data:
                            success = False
                            self.errors.append(f"{name}: Missing key '{key}' in response")
                elif expected_keys and isinstance(response_data, list) and len(response_data) > 0:
                    for key in expected_keys:
                        if key not in response_data[0]:
                            success = False
                            self.errors.append(f"{name}: Missing key '{key}' in response items")

                if success:
                    self.tests_passed += 1
                    print(f"✅ Passed - Status: {response.status_code}")
                    if response_data:
                        print(f"   Response preview: {str(response_data)[:100]}...")
                else:
                    print(f"❌ Failed - Missing expected keys")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.text:
                    print(f"   Error: {response.text[:200]}...")
                self.errors.append(f"{name}: Expected {expected_status}, got {response.status_code}")

            return success, response_data

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Connection Error: {str(e)}")
            self.errors.append(f"{name}: Connection error - {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.errors.append(f"{name}: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API endpoint",
            "GET",
            "",
            200,
            expected_keys=["message"]
        )

    def test_services_endpoint(self):
        """Test services endpoint"""
        success, data = self.run_test(
            "Get services",
            "GET", 
            "services",
            200,
            expected_keys=["id", "name", "slug", "description", "price_per_sqm"]
        )
        
        # Validate specific services exist
        if success and isinstance(data, list):
            service_slugs = [s.get('slug') for s in data]
            expected_slugs = ['hangars', 'grain-storage', 'garages', 'demolition']
            
            for slug in expected_slugs:
                if slug not in service_slugs:
                    print(f"❌ Missing expected service: {slug}")
                    self.errors.append(f"Missing service slug: {slug}")
                    return False, data
                    
        return success, data

    def test_prices_endpoint(self):
        """Test prices endpoint"""
        return self.run_test(
            "Get prices config",
            "GET",
            "prices", 
            200
        )

    def test_price_by_service(self):
        """Test price config by service slug"""
        return self.run_test(
            "Get hangars price config",
            "GET",
            "prices/hangars",
            200,
            expected_keys=["service_slug", "base_price", "price_per_sqm", "height_multipliers", "options"]
        )

    def test_price_invalid_service(self):
        """Test price config for invalid service"""
        return self.run_test(
            "Get invalid service price config",
            "GET",
            "prices/invalid-service",
            200,  # API returns 200 with error message
            expected_keys=["error"]
        )

    def test_calculate_endpoint(self):
        """Test calculation endpoint"""
        calc_data = {
            "service_slug": "hangars",
            "area": 500,
            "height": 8,
            "options": ["insulation", "gates"]
        }
        
        return self.run_test(
            "Calculate cost",
            "POST",
            "calculate", 
            200,
            data=calc_data,
            expected_keys=["base_cost", "area_cost", "height_cost", "options_cost", "total", "breakdown"]
        )

    def test_calculate_invalid_service(self):
        """Test calculation with invalid service"""
        calc_data = {
            "service_slug": "invalid-service",
            "area": 500,
            "height": 8,
            "options": []
        }
        
        success, data = self.run_test(
            "Calculate cost - invalid service",
            "POST",
            "calculate", 
            200,
            data=calc_data
        )
        
        # Check if it returns zero values for invalid service
        if success and data.get("total") == 0:
            print("✅ Correctly handled invalid service")
        elif success:
            print("❌ Should return zero total for invalid service")
            self.errors.append("Calculate endpoint should return zero for invalid service")
            return False, data
            
        return success, data

    def test_contact_endpoint(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "phone": "+7-900-123-45-67", 
            "service_type": "Строительство ангаров",
            "message": "Test message from automated test"
        }
        
        return self.run_test(
            "Submit contact form",
            "POST",
            "contact",
            200,
            data=contact_data,
            expected_keys=["id", "status"]
        )

    def test_portfolio_endpoint(self):
        """Test portfolio endpoint"""
        success, data = self.run_test(
            "Get portfolio",
            "GET",
            "portfolio",
            200,
            expected_keys=["id", "title", "description", "category", "image_url"]
        )
        
        # Check if portfolio has expected categories
        if success and isinstance(data, list):
            categories = [p.get('category') for p in data]
            expected_categories = ['hangars', 'grain-storage', 'garages', 'demolition']
            
            for cat in expected_categories:
                if cat not in categories:
                    print(f"⚠️ Warning: No portfolio items for category {cat}")
                    
        return success, data

    def test_testimonials_endpoint(self):
        """Test testimonials endpoint"""
        return self.run_test(
            "Get testimonials",
            "GET", 
            "testimonials",
            200,
            expected_keys=["id", "name", "company", "text", "rating"]
        )

    def print_summary(self):
        """Print test summary"""
        print(f"\n{'='*50}")
        print(f"📊 BACKEND API TEST SUMMARY")
        print(f"{'='*50}")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Tests failed: {self.tests_run - self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.errors:
            print(f"\n❌ ERRORS FOUND:")
            for error in self.errors:
                print(f"   • {error}")
        
        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting М-СТРОЙ Backend API Tests...")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Use public endpoint from environment
    public_url = "http://localhost:8001"  # Will update if needed
    try:
        with open("/app/frontend/.env", "r") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    public_url = line.split("=", 1)[1].strip()
                    break
    except:
        pass
    
    tester = ConstructionAPITester(f"{public_url}/api")
    
    # Run all tests
    tests = [
        tester.test_root_endpoint,
        tester.test_services_endpoint,
        tester.test_prices_endpoint,
        tester.test_price_by_service,
        tester.test_price_invalid_service,
        tester.test_calculate_endpoint,
        tester.test_calculate_invalid_service,
        tester.test_contact_endpoint,
        tester.test_portfolio_endpoint,
        tester.test_testimonials_endpoint,
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            tester.errors.append(f"Test {test.__name__} failed: {e}")
    
    # Print summary
    success = tester.print_summary()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())