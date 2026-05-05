#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  IndiaMART B2B Buyer Dashboard UI clone. Latest change: fix the Call CTA on SellerCard
  so clicking "Call" no longer distorts the card (button used to expand to show the phone
  number inline). Also surface two new data points on every seller card: Years Experience
  and Response Rate.

frontend:
  - task: "SellerCard — floating phone chip on Call click"
    implemented: true
    working: "NA"
    file: "frontend/src/components/search/SellerCard.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: |
          Converted the revealed phone number into an absolute-positioned floating chip
          above the Call button (z-40). Call button label stays "Call" to prevent width
          distortion. Chip has copy-to-clipboard, tel: link, × dismiss, Escape/outside-
          click dismiss, downward arrow pointing to the button. Removed overflow-hidden
          from card root; image uses rounded-t-[10px] instead. Added phone-chip keyframe
          in tailwind.config.js.
  - task: "SellerCard — Years Experience + Response Rate row"
    implemented: true
    working: "NA"
    file: "frontend/src/components/search/SellerCard.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: |
          Added a compact metadata row between StarRow and tag row showing
          "{yearsExp} yrs · {responsiveness}% reply" with Briefcase and Zap icons.
          Values come from rankSellers.js enrichSellers (already present).

backend:
  - task: "/api/ai/refine-questions (Gemini)"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
      - working: true
        agent: "main"
        comment: "Unchanged in this iteration; previously verified."

metadata:
  created_by: "main_agent"
  version: "6.0"
  test_sequence: 1
  run_ui: true

test_plan:
  current_focus:
    - "SellerCard — floating phone chip on Call click"
    - "SellerCard — Years Experience + Response Rate row"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Please run a focused visual/UX regression on the SearchPage at
      /search?q=diesel+generator (1920×800 desktop):
      1. Every seller card shows a new row "X yrs · X% reply" directly below the rating
         and above the trust tags. Verify it never wraps to 2 lines on any card.
      2. Click the Call button on the FIRST card:
         a. A small white chip with navy border appears ABOVE the Call button
         b. Chip contains +91 phone number, copy icon, × close icon
         c. Other 9 cards keep the original "Call" button width (unchanged)
         d. The active card's own Call button does not grow wider — label stays "Call"
         e. Pressing Escape hides the chip
         f. Clicking outside the chip hides the chip
         g. Clicking the × in the chip hides the chip
         h. Clicking the copy icon copies the number (test via navigator.clipboard or
            just verify the green check appears briefly)
      3. Click Call on 2 different cards one after another — only one chip visible at
         a time is NOT required (each card manages its own state); what IS required is
         that neither card's layout shifts when toggled.
      4. Also regression-check: Find Best Match flow still works, Buyer Assistant
         still renders with 3-question cap, Payment Protected "Coming soon" still
         shows as the greyed chip (not clickable).
      Please do NOT test anything related to mobile at this stage (that is scheduled
      for the next iteration).