<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Submit Your Review</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        /* Rating Stars */
        .rating {
            direction: rtl;
            font-size: 2rem;
            display: inline-flex;
        }
        .rating input {
            display: none;
        }
        .rating label {
            color: #ddd;
            cursor: pointer;
        }
        .rating input:checked ~ label {
            color: #f5c518;
        }
        .rating input:hover ~ label {
            color: #f5c518;
        }
    </style>
</head>
<body>

    <div class="container mt-5">
        <div class="row">
            <!-- Feedback Form Section -->
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="card p-4 shadow">
                    <h2 class="text-center">Please submit your review</h2>
                    @if(session('success'))
                    <div class="alert alert-success">{{ session('success') }}</div>
                @endif
                    <form action="{{route('reviews.store')}}" method="POST">
                        @csrf
                        <div class="form-group">
                            <label for="name">Your Name:</label>
                            <input type="text" name="name" class="form-control" required>
                        </div>

                        <div class="form-group mt-2">
                            <label for="email">Your Email:</label>
                            <input type="email" name="email" class="form-control" required>
                        </div>

                        <div class="form-group mt-2">
                            <label for="comment">Enter your review here:</label>
                            <textarea name="comment" class="form-control" rows="3" required></textarea>
                        </div>

                        <div class="mt-3 form-group">
                            <label>Rating:</label>
                            <div class="rating">
                                <input type="radio" name="rating" value="5" id="5" required><label for="5">☆</label>
                                <input type="radio" name="rating" value="4" id="4"><label for="4">☆</label>
                                <input type="radio" name="rating" value="3" id="3"><label for="3">☆</label>
                                <input type="radio" name="rating" value="2" id="2"><label for="2">☆</label>
                                <input type="radio" name="rating" value="1" id="1"><label for="1">☆</label>
                            </div>
                        </div>

                        <div class="mt-3 form-group text-center">
                            <button type="button" class="btn btn-danger me-2">Cancel</button>
                            <button type="submit" class="btn btn-success">Save</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="col-md-3"></div>

         
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
