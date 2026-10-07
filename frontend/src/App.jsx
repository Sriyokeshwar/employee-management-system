import { useEffect, useState } from 'react'
import './App.css'

// Backend API URL - Intha path-la dhaan employee data-va fetch, create, update, delete panrom
const API_URL = 'http://localhost:5000/api/employees'

// Form-la irukra fields-oda initial empty values (Reset panradhuku use agum)
const emptyForm = {
  name: '',
  role: '',
  email: '',
  phone: ''
}

function App() {
  // --- STATE DECLARATIONS (Variables to manage component state) ---
  const [employees, setEmployees] = useState([]) // Server-la irundhu varra employee list-ah store panra array
  const [form, setForm] = useState(emptyForm) // Input box-la user type panra details-ah store panra object
  const [editingId, setEditingId] = useState(null) // Oru employee-a edit panrapdi id-a store pannum (Null-na pudhu entry)
  const [loading, setLoading] = useState(true) // Data load agra varaikum loading state-ah track panra boolean
  const [submitting, setSubmitting] = useState(false) // Form submit aagum podhu button disable/enable panra state
  const [error, setError] = useState('') // Errors-ah user-ku display panradhuku error message state

  // --- READ OPERATION - GET (Component mount aana odane data-va fetch pannum) ---
  useEffect(() => {
    fetchEmployees()
  }, [])

  // Backend-la irundhu employee details-ah GET panra function
  async function fetchEmployees() {
    try {
      const response = await fetch(API_URL)

      // Response correct-ah illana error throw pannum
      if (!response.ok) {
        throw new Error(
          'Unable to connect to the employee database.'
        )
      }

      const data = await response.json()

      setEmployees(data) // Datang-ah state-la save panrom
      setError('') // Error irundha clear panrom
    } catch (requestError) {
      setError(requestError.message) // Error catch panni state-la set panrom
    } finally {
      setLoading(false) // Loading mudinjadhum false aakidurom
    }
  }

  // --- FORM CHANGE HANDLER (Input box-la type panra pothu state-a update panradhu) ---
  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  // --- CREATE (POST) & UPDATE (PUT) OPERATIONS ---
  async function handleSubmit(event) {
    event.preventDefault() // Page reload-ah prevent panrom

    setSubmitting(true)
    setError('')

    try {
      // editingId irundha PUT method (Update), illana POST method (Create) use pannum
      const response = await fetch(
        editingId
          ? `${API_URL}/${editingId}`
          : API_URL,
        {
          method: editingId ? 'PUT' : 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(form) // Form data-va JSON format-ku maathi anjurom
        }
      )

      // Status 204 (No Content) irundha null, illana JSON convert pannum
      const result =
        response.status === 204
          ? null
          : await response.json()

      if (!response.ok) {
        throw new Error(
          result?.message || 'Unable to save employee.'
        )
      }

      // Success aana form-a empty panni, editingId-a null aakidurom
      setForm(emptyForm)
      setEditingId(null)

      // Updated list-ah server-la irundhu thirumba fetch panrom
      await fetchEmployees()

    } catch (requestError) {
      setError(requestError.message)

    } finally {
      setSubmitting(false)
    }
  }

  // --- EDIT BUTTON CLICK HANDLER (Oru employee-a edit panra mood-ku kondu varum) ---
  function beginEdit(employee) {
    setEditingId(employee.id) // Ethu edit aagudhu nu id-a track panrom

    // Form-la andha employee-oda existing details-ah fill panrom
    setForm({
      name: employee.name,
      role: employee.role,
      email: employee.email,
      phone: employee.phone
    })

    setError('')

    // Screen-oda mela smooth-ah scroll panrom
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // --- DELETE OPERATION ---
  async function deleteEmployee(id) {

    // User-ta confirmation kekum
    if (
      !window.confirm(
        'Delete this employee record?'
      )
    ) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error(
          'Unable to delete employee.'
        )
      }

      // Delete aanavudan UI-la irundhu andha employee-a filter panni remove panrom
      setEmployees((currentEmployees) =>
        currentEmployees.filter(
          (employee) => employee.id !== id
        )
      )

    } catch (requestError) {
      setError(requestError.message)
    }
  }

  // --- CANCEL EDIT OPERATION ---
  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  return (
    <main className="app-shell">

      {/* HEADER SECTION (Title and Total Members count) */}
      <header className="page-header">

        <div>

          <p className="eyebrow">
            People operations
          </p>

          <h1>
            Employee directory
          </h1>

          <p className="subtitle">
            Keep your team details accurate,
            accessible, and up to date.
          </p>

        </div>

        <div className="record-count">

          <strong>
            {employees.length}
          </strong>

          <span>
            team members
          </span>

        </div>

      </header>


      <section className="workspace">

        {/* FORM SECTION (Add / Edit Employee Form) */}
        <form
          className="employee-form"
          onSubmit={handleSubmit}
        >

          <div className="section-heading">

            <div>

              <span className="section-number">
                01
              </span>

              {/* Editing state-ah பொறுத்து Title 'Edit employee' nu illa 'Add employee' nu maarum */}
              <h2>
                {editingId
                  ? 'Edit employee'
                  : 'Add employee'}
              </h2>

            </div>

            <span className="required-note">
              All fields required
            </span>

          </div>


          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div
              className="notice"
              style={{
                color: 'red',
                marginBottom: '10px'
              }}
            >
              {error}
            </div>
          )}


          {/* FORM INPUT FIELDS GRID */}
          <div className="form-grid">

            <label>
              Full name

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                required
              />

            </label>


            <label>
              Role

              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="e.g. Product designer"
                required
              />

            </label>


            <label>
              Email address

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
              />

            </label>


            <label>
              Phone number

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 000 0000"
                required
              />

            </label>

          </div>


          {/* FORM ACTION BUTTONS (Cancel & Submit) */}
          <div className="form-actions">

            {/* Editing panra podhu mattum cancel button-a kaatum */}
            {editingId && (

              <button
                className="button button-quiet"
                type="button"
                onClick={cancelEdit}
              >
                Cancel
              </button>

            )}


            <button
              className="button button-primary"
              type="submit"
              disabled={submitting}
            >

              {/* Submitting aagum podhu text 'Saving...' nu maarum */}
              {submitting
                ? 'Saving...'
                : editingId
                  ? 'Save changes'
                  : 'Add employee'}

              <span>
                ↗
              </span>

            </button>

          </div>

        </form>


        {/* TABLE SECTION (Employee List Table) */}
        <section className="directory-section">

          <div className="section-heading">

            <div>

              <span className="section-number">
                02
              </span>

              <h2>
                All employees
              </h2>

            </div>

            <span className="live-indicator">
              Live directory
            </span>

          </div>


          <div className="table-wrap">

            <table>

              <thead>

                <tr>
                  <th>Employee</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Phone</th>
                  <th aria-label="Actions"></th>
                </tr>

              </thead>


              <tbody>

                {/* Loading aagum podhu loading message-a kaatum */}
                {loading ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-state"
                    >
                      Loading directory...
                    </td>

                  </tr>

                ) : employees.length === 0 ? (

                  /* Employees list empty-ah irundha 'No employees yet' message kaatum */
                  <tr>

                    <td
                      colSpan="5"
                      className="empty-state"
                    >
                      No employees yet.
                      Add the first team member above.
                    </td>

                  </tr>

                ) : (

                  /* Employees data irundha loop panni table row-la display panrom */
                  employees.map((employee) => (

                    <tr key={employee.id}>

                      <td>

                        {/* Employee name-oda first letter-a vachu Avatar icon create panrom */}
                        <span className="avatar">
                          {employee.name
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <strong>
                          {employee.name}
                        </strong>

                      </td>


                      <td>
                        {employee.role}
                      </td>


                      <td>

                        <a
                          href={`mailto:${employee.email}`}
                        >
                          {employee.email}
                        </a>

                      </td>


                      <td>
                        {employee.phone}
                      </td>


                      <td className="actions">

                        {/* EDIT BUTTON */}
                        <button
                          title={`Edit ${employee.name}`}
                          onClick={() =>
                            beginEdit(employee)
                          }
                        >
                          Edit
                        </button>


                        {/* DELETE BUTTON */}
                        <button
                          className="delete-action"
                          title={`Delete ${employee.name}`}
                          onClick={() =>
                            deleteEmployee(
                              employee.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

      </section>

    </main>
  )
}

export default App
