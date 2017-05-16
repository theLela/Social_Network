$(document).ready(function(){

	function getPersons(data){
		var personsList = document.createElement('ul');
		$.each(data, function(i, person){
			var personLi = document.createElement('li');

			var personP = document.createElement('p');
			var personData = "<b>" + person.firstName + "</b>";
			if(person.surname !== "")
				personData += " <b>" + person.surname + "</b>";
			if(person.age !== null)
				personData += ", age: " + person.age;
			personData += ", gender: " + person.gender;
			personP.innerHTML = personData;

			var directFriendsBtn = document.createElement('button');
			directFriendsBtn.innerHTML = "Direct Friends";
			directFriendsBtn.addEventListener('click', displayDirectFriends(person, data));

			var friendsOfFriendsBtn = document.createElement('button');
			friendsOfFriendsBtn.innerHTML = "Friends of Friends";
			friendsOfFriendsBtn.addEventListener('click', displayFriendsOfFriends(person, data));

			var suggestedFriendsBtn = document.createElement('button');
			suggestedFriendsBtn.innerHTML = "Suggested Friends";
			suggestedFriendsBtn.addEventListener('click', displaySuggestedFriends(person, data));

			var directFriendsP = document.createElement('p');
			directFriendsP.setAttribute("id", "directFriendsNames" + person.id);
			directFriendsP.addEventListener("click", function(){this.innerHTML="";});

			var friendsOfFriendsP = document.createElement('p');
			friendsOfFriendsP.setAttribute("id", "friendsOfFriendsNames" + person.id);
			friendsOfFriendsP.addEventListener("click", function(){this.innerHTML="";});

			var suggestedFriendsP = document.createElement('p');
			suggestedFriendsP.setAttribute("id", "suggestedFriendsPNames" + person.id);
			suggestedFriendsP.addEventListener("click", function(){this.innerHTML="";});
			
			personLi.appendChild(personP);
			personLi.appendChild(directFriendsBtn);
			personLi.appendChild(directFriendsP);
			personLi.appendChild(friendsOfFriendsBtn);
			personLi.appendChild(friendsOfFriendsP);
			personLi.appendChild(suggestedFriendsBtn);
			personLi.appendChild(suggestedFriendsP);
			personsList.appendChild(personLi);
		});

		document.querySelector(".persons").appendChild(personsList);

		function displayDirectFriends(person, data){
			return function(){
				var directFriendsNames = document.getElementById('directFriendsNames' + person.id);
				directFriendsNames.innerHTML = "";
				for(let i = 0; i < person.friends.length; i++){
					let name = getName(person.friends[i], data);
					directFriendsNames.innerHTML += name + "</br>";
				}
				directFriendsNames.style.cursor="pointer";
			}
		};

		function displayFriendsOfFriends(person, data){
			return function(){
				var friendsOfFriendsNamesHtml = document.getElementById('friendsOfFriendsNames' + person.id);
				friendsOfFriendsNamesHtml.innerHTML = "";

				var personFriends = person.friends; 				//array of person's friends IDs
				var friendsOfFriendsIDs = []; 						//array of arrays of friends of friends IDs
				for(let i = 0;  i < personFriends.length; i++){
				 	friendsOfFriendsIDs.push(getFriends(personFriends[i], data));
				}
				var flattenFoF =  flatten(friendsOfFriendsIDs);		//making one array of friends of friends IDs
				var filteredFlattenFoF = flattenFoF.filter(function(friendID){				//removing person's id and person's direct friends IDs
					return (friendID !== person.id) && (personFriends.indexOf(friendID) === -1);
				});	
				var uniqueFoF = [];									//removing duplicate elements
				filteredFlattenFoF.forEach(function(element, index){
					if (uniqueFoF.indexOf(element) === -1)
						uniqueFoF.push(element);
				});

				for(let j = 0; j < uniqueFoF.length; j++){			//geting names and inserting into html
					let name = getName(uniqueFoF[j], data);
					friendsOfFriendsNamesHtml.innerHTML += name + "</br>";
				}
				friendsOfFriendsNamesHtml.style.cursor="pointer";
			}					
		};

		const flatten = arr => arr.reduce(
		  (acc, val) => acc.concat(
		    Array.isArray(val) ? flatten(val) : val
		  ),
		  []
		);

		function displaySuggestedFriends(person, data){
			return function(){
				var suggestedFriendsPNames = document.getElementById('suggestedFriendsPNames' + person.id);
				suggestedFriendsPNames.innerHTML = "";

				if(person.friends.length >= 2){
					var personFriends = person.friends;
					var personNotFriends = getNotFriends(person, data);
					var potentialFriends = [];
				 	var suggestedFriends = [];

					for(let i = 0; i < personNotFriends.length; i++){
						let currentPerson = personNotFriends[i];
						let currentPersonFriends = getFriends(currentPerson, data);
						if(currentPersonFriends.length >= 2){
							let counterFriends = 0;
							for(let j = 0; j < currentPersonFriends.length; j++){
								if(personFriends.indexOf(currentPersonFriends[j]) > -1){
									counterFriends ++;	
								}
							}
							if(counterFriends >= 2){
								suggestedFriends.push(currentPerson);
							}
						}
					}

					if(suggestedFriends.length > 0){
						for(let l = 0; l < suggestedFriends.length; l++){
							let name = getName(suggestedFriends[l], data);
							suggestedFriendsPNames.innerHTML += name + "</br>";
						}
					}
					else
						suggestedFriendsPNames.innerHTML = "There are no friends suggestions for this person.";						
				}
				else
					suggestedFriendsPNames.innerHTML = "There are no friends suggestions for this person.";
				suggestedFriendsPNames.style.cursor="pointer";
			}
		};

		function getIds(data){
			var ids = [];
			data.forEach(function(element, index){
				ids.push(element.id);
			});
			return ids;
		}

		function getName(id, data){
			var name = "";
			for(let i = 0; i < data.length; i++){
				if(data[i].id == id)
					name = data[i].firstName + " " + data[i].surname;
			}
			return name;
		};

		function getFriends(id, data){
			var friends = [];
			for(let i = 0; i < data.length; i++){
				if(data[i].id == id)
					friends = data[i].friends;
			}
			return friends;
		};

		function getNotFriends(person, data){
			var personFriends = person.friends;
			var allPersonsIds = getIds(data);
			var notFriends = [];
			notFriends = allPersonsIds.filter(function(id){				//removing person's id and person's direct friends IDs
				return (id !== person.id) && (personFriends.indexOf(id) === -1);
			});
			return notFriends;
		};
	};

	$.getJSON("data.json", getPersons);
});


